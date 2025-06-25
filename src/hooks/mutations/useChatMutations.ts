import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '@/lib/api';
import { Chat, Message, ChatSession } from '@/lib/types';

export const useCreateChat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (agentId: string) => chatApi.createChat(agentId),
    onSuccess: (newChat) => {
      // Add new chat to the chats list
      queryClient.setQueryData(['chats'], (oldChats: Chat[] = []) => [
        newChat,
        ...oldChats,
      ]);
      
      // Invalidate chats query to refetch
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ chatId, content, agentId }: { chatId: string; content: string; agentId: string }) =>
      chatApi.sendMessage(chatId, content, agentId),
    onSuccess: (newMessage, { chatId }) => {
      // Update the chat's messages
      queryClient.setQueryData(['chat', chatId], (oldChat: ChatSession | undefined) => {
        if (!oldChat) return oldChat;
        return {
          ...oldChat,
          messages: [...oldChat.messages, newMessage],
        };
      });
      
      // Update chats list with new message info
      queryClient.setQueryData(['chats'], (oldChats: Chat[] = []) =>
        oldChats.map(chat =>
          chat.id === chatId
            ? {
                ...chat,
                updatedAt: new Date(),
                messageCount: chat.messageCount + 1,
                lastMessage: newMessage.content,
              }
            : chat
        )
      );
    },
  });
};

export const useUpdateChatTitle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ chatId, title }: { chatId: string; title: string }) =>
      chatApi.updateChatTitle(chatId, title),
    onSuccess: (_, { chatId, title }) => {
      // Update chat title in chats list
      queryClient.setQueryData(['chats'], (oldChats: Chat[] = []) =>
        oldChats.map(chat =>
          chat.id === chatId ? { ...chat, title } : chat
        )
      );
      
      // Update chat title in individual chat
      queryClient.setQueryData(['chat', chatId], (oldChat: ChatSession | undefined) => {
        if (!oldChat) return oldChat;
        return { ...oldChat, title };
      });
    },
  });
};

export const useDeleteChat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (chatId: string) => chatApi.deleteChat(chatId),
    onSuccess: (_, chatId) => {
      // Remove chat from chats list
      queryClient.setQueryData(['chats'], (oldChats: Chat[] = []) =>
        oldChats.filter(chat => chat.id !== chatId)
      );
      
      // Remove chat data
      queryClient.removeQueries({ queryKey: ['chat', chatId] });
      queryClient.removeQueries({ queryKey: ['messages', chatId] });
    },
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ chatId, messageIds }: { chatId: string; messageIds: string[] }) =>
      chatApi.markAsRead(chatId, messageIds),
    onSuccess: (_, { chatId, messageIds }) => {
      // Update message read status in chat
      queryClient.setQueryData(['chat', chatId], (oldChat: ChatSession | undefined) => {
        if (!oldChat) return oldChat;
        return {
          ...oldChat,
          messages: oldChat.messages.map((msg: Message) =>
            messageIds.includes(msg.id)
              ? { ...msg, metadata: { ...msg.metadata, read: true } }
              : msg
          ),
        };
      });
    },
  });
}; 