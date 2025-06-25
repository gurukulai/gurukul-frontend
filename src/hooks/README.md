# Chat Hooks Architecture

This directory contains a well-structured set of React hooks for managing chat functionality using React Query and custom hooks.

## Structure

```
src/hooks/
├── index.ts                    # Main exports
├── useChat.ts                  # Main chat hook (combines everything)
├── queries/
│   └── useChats.ts            # Query hooks for data fetching
├── mutations/
│   └── useChatMutations.ts    # Mutation hooks for data changes
├── websocket/
│   └── useWebSocket.ts        # WebSocket hook for real-time features
├── use-toast.ts               # Toast notifications
└── use-mobile.tsx             # Mobile detection
```

## Hooks Overview

### Main Hook: `useChat`
The primary hook that combines all chat functionality:

```typescript
const {
  // Data
  chats,
  currentChat,
  currentChatId,
  
  // Loading states
  isLoading,
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
  
  // Direct access to mutations
  createChatMutation,
  sendMessageMutation,
  updateChatTitleMutation,
  deleteChatMutation,
  markAsReadMutation
} = useChat();
```

### Query Hooks
For data fetching with React Query:

- `useChats()` - Fetch all chats
- `useChat(chatId)` - Fetch a specific chat
- `useMessages(chatId, page, limit)` - Fetch messages with pagination

### Mutation Hooks
For data mutations with optimistic updates:

- `useCreateChat()` - Create a new chat
- `useSendMessage()` - Send a message
- `useUpdateChatTitle()` - Update chat title
- `useDeleteChat()` - Delete a chat
- `useMarkAsRead()` - Mark messages as read

### WebSocket Hook
For real-time functionality:

```typescript
const {
  isConnected,
  error,
  sendMessage,
  sendTyping,
  joinChat,
  leaveChat,
  sendReadReceipt,
  setCurrentChatId
} = useWebSocket();
```

## Usage Examples

### Basic Usage
```typescript
import { useChat } from '@/hooks';

function ChatComponent() {
  const {
    chats,
    currentChat,
    sendMessage,
    isLoading,
    error
  } = useChat();

  const handleSendMessage = (content: string) => {
    sendMessage(content, 'agent-id');
  };

  // ... rest of component
}
```

### Direct Query Usage
```typescript
import { useChats, useChat } from '@/hooks';

function ChatList() {
  const { data: chats, isLoading } = useChats();
  const { data: currentChat } = useChat(chatId);

  // ... component logic
}
```

### Direct Mutation Usage
```typescript
import { useCreateChat, useSendMessage } from '@/hooks';

function ChatActions() {
  const createChat = useCreateChat();
  const sendMessage = useSendMessage();

  const handleCreateChat = async () => {
    const chatId = await createChat.mutateAsync('agent-id');
    // Handle success
  };

  const handleSendMessage = async () => {
    await sendMessage.mutateAsync({
      chatId: 'chat-id',
      content: 'Hello',
      agentId: 'agent-id'
    });
  };
}
```

## Benefits

1. **Separation of Concerns**: Each hook has a single responsibility
2. **Reusability**: Hooks can be used independently or together
3. **Type Safety**: Full TypeScript support
4. **Caching**: React Query handles caching automatically
5. **Optimistic Updates**: Mutations provide immediate UI feedback
6. **Error Handling**: Centralized error management
7. **Real-time**: WebSocket integration for live updates
8. **Testing**: Easy to test individual hooks

## Migration from Old Context

The old `ChatContext` has been simplified to use the new hook structure:

```typescript
// Old way
const { sendMessage, chats } = useChatContext();

// New way (same interface)
const { sendMessage, chats } = useChatContext();

// Or use the hook directly
const { sendMessage, chats } = useChat();
```

## Configuration

React Query is configured in `src/App.tsx`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
```

## Error Handling

Errors are handled at multiple levels:
- Individual hooks handle their own errors
- The main `useChat` hook aggregates errors
- Components can access errors via the `error` property
- WebSocket errors are handled separately

## Performance

- React Query provides automatic caching and background updates
- Optimistic updates for better UX
- WebSocket for real-time updates
- Proper cleanup on unmount
- Debounced typing indicators 