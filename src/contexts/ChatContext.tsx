'use client';

import { createContext, useContext, ReactNode } from 'react';
import { ChatContextType } from '@/lib/types';
import { useChat as useChatHook } from '@/hooks/useChat';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

// Backward compatibility - export useChat as an alias
export const useChat = useChatContext;

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const chatHook = useChatHook();

  // Transform the hook return value to match the expected context type
  const contextValue: ChatContextType = {
    currentChat: chatHook.currentChat,
    chats: chatHook.chats,
    sendMessage: chatHook.sendMessage,
    loadChat: chatHook.loadChat,
    createNewChat: chatHook.createNewChat,
    updateChatTitle: chatHook.updateChatTitle,
    deleteChat: chatHook.deleteChat,
    isTyping: chatHook.isTyping,
    isLoading: chatHook.isLoading,
    error: chatHook.error,
    loadChats: async () => {
      // This is now handled by React Query automatically
      // We can invalidate the query if needed
      // No-op function for backward compatibility
    },
    isConnected: chatHook.isConnected
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};
