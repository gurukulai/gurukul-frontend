'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from 'react';
import { ChatContextType, ChatSession, Chat, Message } from '@/lib/types';
import { CHAT_CONFIG } from '@/lib/constants';
import { useAuth } from './AuthContext';
import { chatApi, ApiError } from '@/lib/api';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const { user } = useAuth();
  const [currentChat, setCurrentChat] = useState<ChatSession | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs for polling
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  // Load chats on mount and when user changes
  useEffect(() => {
    if (user) {
      loadChats();
    } else {
      setChats([]);
      setCurrentChat(null);
    }
  }, [user]);

  // Start/stop polling for new messages
  useEffect(() => {
    if (currentChat?.chatId && user) {
      startPolling();
      return () => stopPolling();
    }
  }, [currentChat?.chatId, user]);

  const loadChats = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const fetchedChats = await chatApi.getChats();
      setChats(fetchedChats);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? `Failed to load chats: ${err.message}` 
        : 'Failed to load chats';
      setError(errorMessage);
      console.error('Load chats error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(async () => {
      if (!currentChat?.chatId || !user) return;

      try {
        const newMessages = await chatApi.pollMessages(
          currentChat.chatId, 
          lastMessageIdRef.current
        );

        if (newMessages.length > 0) {
          setCurrentChat(prev => prev ? {
            ...prev,
            messages: [...prev.messages, ...newMessages],
            hasNewMessages: true
          } : null);

          // Update last message ID
          const lastMessage = newMessages[newMessages.length - 1];
          lastMessageIdRef.current = lastMessage.id;

          // Mark messages as read
          await chatApi.markAsRead(currentChat.chatId, newMessages.map(m => m.id));
        }
      } catch (err) {
        console.error('Polling error:', err);
        // Don't show polling errors to user as they're not critical
      }
    }, CHAT_CONFIG.POLLING_INTERVAL);
  }, [currentChat?.chatId, user]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const createNewChat = useCallback(async (agentId: string): Promise<string> => {
    try {
      const newChat = await chatApi.createChat(agentId);
      
      const newChatSession: ChatSession = {
        chatId: newChat.id,
        messages: [],
        isLoading: false,
        hasNewMessages: false,
        pollCount: 0
      };

      setCurrentChat(newChatSession);
      setChats(prev => [newChat, ...prev]);
      
      return newChat.id;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? `Failed to create new chat: ${err.message}` 
        : 'Failed to create new chat';
      setError(errorMessage);
      console.error('Create chat error:', err);
      throw err;
    }
  }, []);

  const sendMessage = useCallback(async (content: string, agentId: string, chatId?: string) => {
    if (!user) {
      setError('Please log in to send messages');
      return;
    }

    try {
      setError(null);
      setIsTyping(true);
      
      const finalChatId = chatId || currentChat?.chatId || await createNewChat(agentId);
      
      // Add user message immediately for optimistic UI
      const userMessage: Message = {
        id: `temp-${Date.now()}-user`,
        chatId: finalChatId,
        userId: user.id,
        agentId,
        content,
        role: 'user',
        timestamp: new Date()
      };

      setCurrentChat(prev => prev ? {
        ...prev,
        messages: [...prev.messages, userMessage]
      } : null);

      // Send message to backend
      const sentMessage = await chatApi.sendMessage(finalChatId, content, agentId);
      
      // Replace temporary message with real one
      setCurrentChat(prev => prev ? {
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === userMessage.id ? sentMessage : msg
        )
      } : null);

      // Update last message ID for polling
      lastMessageIdRef.current = sentMessage.id;

      // Update chat list with new message
      setChats(prev => prev.map(chat => 
        chat.id === finalChatId 
          ? { 
              ...chat, 
              updatedAt: new Date(),
              messageCount: chat.messageCount + 1,
              lastMessage: content
            }
          : chat
      ));

    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? `Failed to send message: ${err.message}` 
        : 'Failed to send message. Please try again.';
      setError(errorMessage);
      console.error('Send message error:', err);
      
      // Remove temporary message on error
      setCurrentChat(prev => prev ? {
        ...prev,
        messages: prev.messages.filter(msg => !msg.id.startsWith('temp-'))
      } : null);
    } finally {
      setIsTyping(false);
    }
  }, [user, currentChat, createNewChat]);

  const loadChat = useCallback(async (chatId: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const chatSession = await chatApi.getChat(chatId);
      setCurrentChat(chatSession);
      
      // Set last message ID for polling
      if (chatSession.messages.length > 0) {
        const lastMessage = chatSession.messages[chatSession.messages.length - 1];
        lastMessageIdRef.current = lastMessage.id;
      }

      // Mark messages as read
      const unreadMessages = chatSession.messages.filter(msg => 
        msg.role === 'assistant' && !msg.metadata?.read
      );
      if (unreadMessages.length > 0) {
        await chatApi.markAsRead(chatId, unreadMessages.map(m => m.id));
      }

    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? `Failed to load chat: ${err.message}` 
        : 'Failed to load chat';
      setError(errorMessage);
      console.error('Load chat error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateChatTitle = useCallback(async (chatId: string, title: string) => {
    try {
      await chatApi.updateChatTitle(chatId, title);
      setChats(prev => prev.map(chat => 
        chat.id === chatId ? { ...chat, title } : chat
      ));
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? `Failed to update chat title: ${err.message}` 
        : 'Failed to update chat title';
      setError(errorMessage);
      console.error('Update chat title error:', err);
    }
  }, []);

  const deleteChat = useCallback(async (chatId: string) => {
    try {
      await chatApi.deleteChat(chatId);
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      
      // If deleted chat is current chat, clear it
      if (currentChat?.chatId === chatId) {
        setCurrentChat(null);
        lastMessageIdRef.current = null;
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? `Failed to delete chat: ${err.message}` 
        : 'Failed to delete chat';
      setError(errorMessage);
      console.error('Delete chat error:', err);
    }
  }, [currentChat]);

  const value: ChatContextType = {
    currentChat,
    chats,
    sendMessage,
    loadChat,
    createNewChat,
    updateChatTitle,
    deleteChat,
    isTyping,
    isLoading,
    error,
    loadChats
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
