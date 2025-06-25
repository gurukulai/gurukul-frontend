import { useState, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useChats, useChat as useChatQuery } from './queries/useChats';
import { 
  useCreateChat, 
  useSendMessage, 
  useUpdateChatTitle, 
  useDeleteChat, 
  useMarkAsRead 
} from './mutations/useChatMutations';
import { useWebSocket } from './websocket/useWebSocket';
import { Message, ChatSession } from '@/lib/types';

export const useChat = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Query hooks
  const { data: chats = [], isLoading: isLoadingChats, error: chatsError } = useChats();
  const { data: currentChat, isLoading: isLoadingChat, error: chatError } = useChatQuery(currentChatId);

  // Mutation hooks
  const createChatMutation = useCreateChat();
  const sendMessageMutation = useSendMessage();
  const updateChatTitleMutation = useUpdateChatTitle();
  const deleteChatMutation = useDeleteChat();
  const markAsReadMutation = useMarkAsRead();

  // WebSocket hook
  const {
    isConnected,
    error: wsError,
    sendMessage: wsSendMessage,
    sendTyping,
    joinChat,
    leaveChat,
    sendReadReceipt,
    setCurrentChatId: setWsCurrentChatId
  } = useWebSocket();

  // Listen for typing events
  useEffect(() => {
    const handleTypingStatus = (event: CustomEvent) => {
      if (event.detail.chatId === currentChatId) {
        setIsTyping(event.detail.isTyping);
      }
    };

    window.addEventListener('typing-status', handleTypingStatus as EventListener);
    return () => {
      window.removeEventListener('typing-status', handleTypingStatus as EventListener);
    };
  }, [currentChatId]);

  // Update WebSocket current chat ID
  useEffect(() => {
    setWsCurrentChatId(currentChatId);
  }, [currentChatId, setWsCurrentChatId]);

  // Handle errors
  useEffect(() => {
    const newError = chatsError?.message || chatError?.message || wsError;
    setError(newError || null);
  }, [chatsError, chatError, wsError]);

  const createNewChat = useCallback(async (agentId: string): Promise<string> => {
    try {
      setError(null);
      const newChat = await createChatMutation.mutateAsync(agentId);
      
      // Set as current chat
      setCurrentChatId(newChat.id);
      joinChat(newChat.id);
      
      return newChat.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create new chat';
      setError(errorMessage);
      throw err;
    }
  }, [createChatMutation, joinChat]);

  const loadChat = useCallback(async (chatId: string) => {
    try {
      setError(null);
      setCurrentChatId(chatId);
      joinChat(chatId);

      // Mark messages as read
      const chatData = queryClient.getQueryData(['chat', chatId]) as ChatSession | undefined;
      if (chatData?.messages) {
        const unreadMessages = chatData.messages.filter((msg: Message) => 
          msg.role === 'assistant' && !msg.metadata?.read
        );
        if (unreadMessages.length > 0) {
          const messageIds = unreadMessages.map((m: Message) => m.id);
          await markAsReadMutation.mutateAsync({ chatId, messageIds });
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load chat';
      setError(errorMessage);
    }
  }, [joinChat, markAsReadMutation, queryClient]);

  const sendMessage = useCallback(async (content: string, agentId: string, chatId?: string) => {
    if (!user) {
      setError('Please log in to send messages');
      return;
    }

    try {
      setError(null);
      
      const finalChatId = chatId || currentChatId || await createNewChat(agentId);
      
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

      // Optimistically update the chat
      queryClient.setQueryData(['chat', finalChatId], (oldChat: ChatSession | undefined) => {
        if (!oldChat) return oldChat;
        return {
          ...oldChat,
          messages: [...oldChat.messages, userMessage]
        };
      });

      // Send via WebSocket (will be queued if not connected)
      wsSendMessage(finalChatId, content, agentId);
      
      // Send typing indicator if connected
      if (isConnected) {
        sendTyping(finalChatId, user.id, agentId, true);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      
      // Remove temporary message on error
      if (currentChatId) {
        queryClient.setQueryData(['chat', currentChatId], (oldChat: ChatSession | undefined) => {
          if (!oldChat) return oldChat;
          return {
            ...oldChat,
            messages: oldChat.messages.filter((msg: Message) => !msg.id.startsWith('temp-'))
          };
        });
      }
    }
  }, [user, currentChatId, createNewChat, wsSendMessage, sendTyping, isConnected, queryClient]);

  const updateChatTitle = useCallback(async (chatId: string, title: string) => {
    try {
      setError(null);
      await updateChatTitleMutation.mutateAsync({ chatId, title });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update chat title';
      setError(errorMessage);
    }
  }, [updateChatTitleMutation]);

  const deleteChat = useCallback(async (chatId: string) => {
    try {
      setError(null);
      await deleteChatMutation.mutateAsync(chatId);
      
      // Leave the chat room via WebSocket
      leaveChat(chatId);
      
      // If deleted chat is current chat, clear it
      if (currentChatId === chatId) {
        setCurrentChatId(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete chat';
      setError(errorMessage);
    }
  }, [currentChatId, deleteChatMutation, leaveChat]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Data
    chats,
    currentChat,
    currentChatId,
    
    // Loading states
    isLoading: isLoadingChats || isLoadingChat,
    isLoadingChats,
    isLoadingChat,
    
    // Status
    isTyping,
    isConnected,
    error,
    
    // Actions
    sendMessage,
    loadChat,
    createNewChat,
    updateChatTitle,
    deleteChat,
    setCurrentChatId,
    clearError,
    
    // Mutations for direct access if needed
    createChatMutation,
    sendMessageMutation,
    updateChatTitleMutation,
    deleteChatMutation,
    markAsReadMutation
  };
}; 