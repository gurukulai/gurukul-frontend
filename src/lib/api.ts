import { Message, Chat, ChatSession, ApiResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const chatApi = {
  // Get all chats for a user
  getChats: async (): Promise<Chat[]> => {
    const response = await fetch(`${API_BASE_URL}/chats`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const result: ApiResponse<Chat[]> = await handleResponse(response);
    return result.data || [];
  },

  // Get a specific chat with messages
  getChat: async (chatId: string): Promise<ChatSession> => {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const result: ApiResponse<ChatSession> = await handleResponse(response);
    if (!result.data) {
      throw new Error('Chat not found');
    }
    return result.data;
  },

  // Create a new chat
  createChat: async (agentId: string): Promise<Chat> => {
    const response = await fetch(`${API_BASE_URL}/chats`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ agentId }),
    });
    const result: ApiResponse<Chat> = await handleResponse(response);
    if (!result.data) {
      throw new Error('Failed to create chat');
    }
    return result.data;
  },

  // Send a message
  sendMessage: async (chatId: string, content: string, agentId: string): Promise<Message> => {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content, agentId }),
    });
    const result: ApiResponse<Message> = await handleResponse(response);
    if (!result.data) {
      throw new Error('Failed to send message');
    }
    return result.data;
  },

  // Get messages for a chat (with pagination)
  getMessages: async (chatId: string, page: number = 1, limit: number = 50): Promise<{
    messages: Message[];
    hasMore: boolean;
    total: number;
  }> => {
    const response = await fetch(
      `${API_BASE_URL}/chats/${chatId}/messages?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );
    const result: ApiResponse<{
      messages: Message[];
      hasMore: boolean;
      total: number;
    }> = await handleResponse(response);
    return result.data || { messages: [], hasMore: false, total: 0 };
  },

  // Poll for new messages (for real-time updates)
  pollMessages: async (chatId: string, lastMessageId?: string): Promise<Message[]> => {
    const params = new URLSearchParams();
    if (lastMessageId) {
      params.append('lastMessageId', lastMessageId);
    }
    
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages/poll?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const result: ApiResponse<Message[]> = await handleResponse(response);
    return result.data || [];
  },

  // Update chat title
  updateChatTitle: async (chatId: string, title: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title }),
    });
    await handleResponse(response);
  },

  // Delete a chat
  deleteChat: async (chatId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    await handleResponse(response);
  },

  // Mark messages as read
  markAsRead: async (chatId: string, messageIds: string[]): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages/read`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ messageIds }),
    });
    await handleResponse(response);
  },
};

export { ApiError }; 