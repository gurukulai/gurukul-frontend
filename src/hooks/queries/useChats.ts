import { useQuery } from '@tanstack/react-query';
import { chatApi } from '@/lib/api';
import { Chat } from '@/lib/types';

export const useChats = () => {
  return useQuery({
    queryKey: ['chats'],
    queryFn: chatApi.getChats,
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useChat = (chatId: string | null) => {
  return useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => chatApi.getChat(chatId!),
    enabled: !!chatId,
    staleTime: 10000, // 10 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useMessages = (chatId: string | null, page: number = 1, limit: number = 50) => {
  return useQuery({
    queryKey: ['messages', chatId, page, limit],
    queryFn: () => chatApi.getMessages(chatId!, page, limit),
    enabled: !!chatId,
    staleTime: 5000, // 5 seconds
    gcTime: 60 * 1000, // 1 minute
  });
}; 