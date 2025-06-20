'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { ChatContextType, ChatSession, Chat, Message } from '@/lib/types';
import { CHAT_CONFIG } from '@/lib/constants';
import { useAuth } from './AuthContext';

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

  const generateMockResponse = useCallback((agentId: string, userMessage: string): Message[] => {
    const responses = {
      therapist: [
        "I understand you're going through a challenging time. Let's explore this together.",
        "Your feelings are completely valid. Can you tell me more about what's been on your mind?",
        "It's important to acknowledge these emotions. How long have you been feeling this way?",
      ],
      dietician: [
        "Based on what you've shared, I'd recommend focusing on balanced nutrition.",
        "Let's create a meal plan that works with your lifestyle and preferences.",
        "Nutrition is very personal. What are your current eating habits like?",
      ],
      career: [
        "That's an excellent career goal! Let's break down the steps to get you there.",
        "Your skills are valuable. Here's how we can leverage them for your next opportunity.",
        "Career growth requires strategic planning. What's your timeline for these changes?",
      ],
      priya: [
        "I'm here to help! What would you like to know or discuss today?",
        "That's interesting! Tell me more about what you're thinking.",
        "I love chatting about different topics. What's on your mind?",
      ],
    };

    const agentResponses = responses[agentId as keyof typeof responses] || responses.priya;
    const randomResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)];

    return [{
      id: `msg-${Date.now()}-${Math.random()}`,
      chatId: currentChat?.chatId || '',
      userId: 'assistant',
      agentId,
      content: randomResponse,
      role: 'assistant',
      timestamp: new Date(),
      metadata: {
        messageIndex: 1,
        totalMessages: 1,
        confidence: 0.95
      }
    }];
  }, [currentChat]);

  const sendMessage = useCallback(async (content: string, agentId: string, chatId?: string) => {
    if (!user) {
      setError('Please log in to send messages');
      return;
    }

    try {
      setError(null);
      
      const finalChatId = chatId || currentChat?.chatId || await createNewChat(agentId);
      
      // Add user message immediately
      const userMessage: Message = {
        id: `msg-${Date.now()}-user`,
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

      // Random delay for typing animation (1-3 seconds)
      const typingDelay = Math.random() * 2000 + 1000; // 1000-3000ms
      
      setTimeout(() => {
        setIsTyping(true);
      }, typingDelay);

      // Total response time (typing delay + response time)
      const totalDelay = typingDelay + CHAT_CONFIG.TYPING_DELAY;
      
      setTimeout(async () => {
        // Generate mock response
        const mockMessages = generateMockResponse(agentId, content);
        
        // Add messages with delay for realistic effect
        for (let i = 0; i < mockMessages.length; i++) {
          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, CHAT_CONFIG.MESSAGE_DISPLAY_DELAY));
          }
          
          setCurrentChat(prev => prev ? {
            ...prev,
            messages: [...prev.messages, mockMessages[i]]
          } : null);
        }
        
        setIsTyping(false);
      }, totalDelay);

    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Send message error:', err);
      setIsTyping(false);
    }
  }, [user, currentChat, generateMockResponse]);

  const loadChat = useCallback(async (chatId: string) => {
    try {
      setError(null);
      
      const mockChat: ChatSession = {
        chatId,
        messages: [],
        isLoading: false,
        hasNewMessages: false,
        pollCount: 0
      };

      setCurrentChat(mockChat);
    } catch (err) {
      setError('Failed to load chat');
      console.error('Load chat error:', err);
    }
  }, []);

  const createNewChat = useCallback(async (agentId: string): Promise<string> => {
    try {
      const newChatId = `chat-${Date.now()}-${agentId}`;
      
      const newChat: ChatSession = {
        chatId: newChatId,
        messages: [],
        isLoading: false,
        hasNewMessages: false,
        pollCount: 0
      };

      setCurrentChat(newChat);
      
      // Add to chats list
      const newChatItem: Chat = {
        id: newChatId,
        userId: user?.id || '',
        agentId,
        title: `New ${agentId} chat`,
        createdAt: new Date(),
        updatedAt: new Date(),
        messageCount: 0
      };
      
      setChats(prev => [newChatItem, ...prev]);
      
      return newChatId;
    } catch (err) {
      setError('Failed to create new chat');
      console.error('Create chat error:', err);
      throw err;
    }
  }, [user]);

  const value: ChatContextType = {
    currentChat,
    chats,
    sendMessage,
    loadChat,
    createNewChat,
    isTyping,
    error
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
