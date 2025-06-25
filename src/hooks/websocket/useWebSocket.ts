import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socketService, TypingEvent, ReadReceipt, MessageData, ChatUpdate, ErrorData } from '@/lib/socket';
import { Message, Chat, ChatSession } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

export const useWebSocket = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentChatIdRef = useRef<string | null>(null);

  const initializeWebSocket = useCallback(async (token: string) => {
    try {
      await socketService.connect(token);
      setIsConnected(true);
      setError(null);
      setupWebSocketListeners();
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setError('Failed to establish real-time connection');
    }
  }, []);

  const setupWebSocketListeners = useCallback(() => {
    // Listen for new messages
    socketService.on('message', handleNewMessage);
    
    // Listen for typing events
    socketService.on('typing', handleTypingEvent);
    
    // Listen for read receipts
    socketService.on('read_receipt', handleReadReceipt);
    
    // Listen for chat updates
    socketService.on('chat_update', handleChatUpdate);
    
    // Listen for connection events
    socketService.on('error', handleSocketError);
    socketService.on('disconnect', handleSocketDisconnect);
  }, []);

  const handleNewMessage = useCallback((data: MessageData) => {
    if (data.message) {
      // Update chat messages
      queryClient.setQueryData(['chat', data.chatId], (oldChat: ChatSession | undefined) => {
        if (!oldChat) return oldChat;
        
        // Replace temporary message if it exists
        const messages = oldChat.messages.map((msg: Message) => 
          msg.id === data.messageId ? data.message! : msg
        );
        
        // Add new message if it doesn't exist
        if (!messages.find((msg: Message) => msg.id === data.message!.id)) {
          messages.push(data.message!);
        }
        
        return {
          ...oldChat,
          messages,
          hasNewMessages: true
        };
      });

      // Update chat list
      queryClient.setQueryData(['chats'], (oldChats: Chat[] = []) =>
        oldChats.map(chat => 
          chat.id === data.chatId 
            ? { 
                ...chat, 
                updatedAt: new Date(),
                messageCount: chat.messageCount + 1,
                lastMessage: data.message!.content
              }
            : chat
        )
      );
    }
  }, [queryClient]);

  const handleTypingEvent = useCallback((data: TypingEvent) => {
    if (data.chatId === currentChatIdRef.current && data.userId === 'assistant') {
      // You can emit a custom event or use a state management solution
      // to notify components about typing status
      window.dispatchEvent(new CustomEvent('typing-status', { 
        detail: { isTyping: data.isTyping, chatId: data.chatId } 
      }));
    }
  }, []);

  const handleReadReceipt = useCallback((data: ReadReceipt) => {
    queryClient.setQueryData(['chat', data.chatId], (oldChat: ChatSession | undefined) => {
      if (!oldChat) return oldChat;
      
      const messages = oldChat.messages.map((msg: Message) => 
        data.messageIds.includes(msg.id) 
          ? { ...msg, metadata: { ...msg.metadata, read: true } }
          : msg
      );
      
      return { ...oldChat, messages };
    });
  }, [queryClient]);

  const handleChatUpdate = useCallback((data: ChatUpdate) => {
    if (data.updates) {
      queryClient.setQueryData(['chats'], (oldChats: Chat[] = []) =>
        oldChats.map(chat => 
          chat.id === data.chatId 
            ? { ...chat, ...data.updates }
            : chat
        )
      );
    }
  }, [queryClient]);

  const handleSocketError = useCallback((data: ErrorData) => {
    console.error('WebSocket error:', data);
    setError('Real-time connection error. Messages may be delayed.');
  }, []);

  const handleSocketDisconnect = useCallback((data: ErrorData) => {
    console.log('WebSocket disconnected:', data);
    setIsConnected(false);
    setError('Connection lost. Attempting to reconnect...');
  }, []);

  const sendMessage = useCallback((chatId: string, content: string, agentId: string) => {
    if (!isConnected) return false;
    
    socketService.sendMessage(chatId, content, agentId);
    return true;
  }, [isConnected]);

  const sendTyping = useCallback((chatId: string, userId: string, agentId: string, isTyping: boolean) => {
    if (!isConnected) return;
    
    socketService.sendTyping(chatId, userId, agentId, isTyping);
    
    if (isTyping && typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        socketService.sendTyping(chatId, userId, agentId, false);
      }, 3000);
    }
  }, [isConnected]);

  const joinChat = useCallback((chatId: string) => {
    if (isConnected) {
      socketService.joinChat(chatId);
      currentChatIdRef.current = chatId;
    }
  }, [isConnected]);

  const leaveChat = useCallback((chatId: string) => {
    if (isConnected) {
      socketService.leaveChat(chatId);
      if (currentChatIdRef.current === chatId) {
        currentChatIdRef.current = null;
      }
    }
  }, [isConnected]);

  const sendReadReceipt = useCallback((chatId: string, messageIds: string[], userId: string) => {
    if (isConnected) {
      socketService.sendReadReceipt(chatId, messageIds, userId);
    }
  }, [isConnected]);

  // Initialize WebSocket when user changes
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('authToken');
      if (token) {
        initializeWebSocket(token);
      }
    } else {
      socketService.disconnect();
      setIsConnected(false);
      setError(null);
    }
  }, [user, initializeWebSocket]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      socketService.disconnect();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    isConnected,
    error,
    sendMessage,
    sendTyping,
    joinChat,
    leaveChat,
    sendReadReceipt,
    setCurrentChatId: (chatId: string | null) => {
      currentChatIdRef.current = chatId;
    }
  };
}; 