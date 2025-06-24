# WebSocket Backend Specifications for Gurukul Chat System

## Overview
This document outlines the WebSocket implementation requirements for real-time bidirectional communication in the Gurukul Chat System. The WebSocket server should handle message delivery, typing indicators, read receipts, and chat room management.

## WebSocket Server Configuration

### Connection Details
- **WebSocket URL**: `ws://localhost:3001/ws` (configurable via `VITE_WS_URL`)
- **Protocol**: WebSocket (ws:// for development, wss:// for production)
- **Authentication**: JWT token passed as query parameter
- **Connection Timeout**: 10 seconds
- **Ping/Pong**: Every 30 seconds to maintain connection

### Connection URL Format
```
ws://localhost:3001/ws?token=<jwt_token>
```

## Message Format

### Base Message Structure
All WebSocket messages follow this JSON structure:
```typescript
interface SocketMessage {
  type: 'message' | 'typing' | 'read_receipt' | 'chat_update' | 'error' | 'ping' | 'pong';
  data: SocketMessageData;
  timestamp: number;
  messageId?: string;
}
```

### Message Types and Data Structures

#### 1. Message Events
```typescript
// Client -> Server: Send message
{
  "type": "message",
  "data": {
    "chatId": "chat-123",
    "content": "Hello, how are you?",
    "agentId": "therapist",
    "messageId": "temp-1234567890"
  },
  "timestamp": 1703123456789,
  "messageId": "temp-1234567890"
}

// Server -> Client: Message received/processed
{
  "type": "message",
  "data": {
    "chatId": "chat-123",
    "message": {
      "id": "msg-1234567890",
      "chatId": "chat-123",
      "userId": "assistant",
      "agentId": "therapist",
      "content": "I'm doing well, thank you for asking. How are you feeling today?",
      "role": "assistant",
      "timestamp": "2024-01-15T10:30:00Z",
      "metadata": {
        "confidence": 0.95,
        "messageIndex": 1,
        "totalMessages": 1
      }
    },
    "messageId": "temp-1234567890"
  },
  "timestamp": 1703123456789
}
```

#### 2. Typing Events
```typescript
// Client -> Server: User typing
{
  "type": "typing",
  "data": {
    "chatId": "chat-123",
    "userId": "user-456",
    "agentId": "therapist",
    "isTyping": true
  },
  "timestamp": 1703123456789
}

// Server -> Client: AI agent typing
{
  "type": "typing",
  "data": {
    "chatId": "chat-123",
    "userId": "assistant",
    "agentId": "therapist",
    "isTyping": true
  },
  "timestamp": 1703123456789
}
```

#### 3. Read Receipts
```typescript
// Client -> Server: Mark messages as read
{
  "type": "read_receipt",
  "data": {
    "chatId": "chat-123",
    "messageIds": ["msg-123", "msg-124"],
    "userId": "user-456"
  },
  "timestamp": 1703123456789
}

// Server -> Client: Read receipt confirmation
{
  "type": "read_receipt",
  "data": {
    "chatId": "chat-123",
    "messageIds": ["msg-123", "msg-124"],
    "userId": "user-456",
    "confirmed": true
  },
  "timestamp": 1703123456789
}
```

#### 4. Chat Room Management
```typescript
// Client -> Server: Join chat room
{
  "type": "chat_update",
  "data": {
    "action": "join",
    "chatId": "chat-123"
  },
  "timestamp": 1703123456789
}

// Client -> Server: Leave chat room
{
  "type": "chat_update",
  "data": {
    "action": "leave",
    "chatId": "chat-123"
  },
  "timestamp": 1703123456789
}

// Server -> Client: Chat updated
{
  "type": "chat_update",
  "data": {
    "chatId": "chat-123",
    "updates": {
      "title": "Updated Chat Title",
      "messageCount": 15,
      "lastMessage": "Latest message content"
    }
  },
  "timestamp": 1703123456789
}
```

#### 5. Connection Management
```typescript
// Client -> Server: Ping
{
  "type": "ping",
  "data": {
    "timestamp": 1703123456789
  },
  "timestamp": 1703123456789
}

// Server -> Client: Pong
{
  "type": "pong",
  "data": {
    "timestamp": 1703123456789
  },
  "timestamp": 1703123456789
}
```

#### 6. Error Handling
```typescript
// Server -> Client: Error message
{
  "type": "error",
  "data": {
    "message": "Authentication failed",
    "code": 401
  },
  "timestamp": 1703123456789
}
```

## Server Implementation Requirements

### 1. Connection Management

#### Authentication
```javascript
// Extract and validate JWT token from query parameters
const token = new URL(url).searchParams.get('token');
const user = await validateJWTToken(token);

if (!user) {
  ws.close(1008, 'Authentication failed');
  return;
}
```

#### Connection Tracking
```javascript
// Store active connections
const connections = new Map();
const chatRooms = new Map(); // chatId -> Set of connection IDs

// Track user connection
connections.set(connectionId, {
  userId: user.id,
  ws: ws,
  joinedChats: new Set(),
  lastPing: Date.now()
});
```

### 2. Message Processing

#### Message Flow
1. **Receive message** from client
2. **Validate** message format and permissions
3. **Process** with AI agent (if assistant message)
4. **Store** in database
5. **Broadcast** to all users in chat room
6. **Send confirmation** to sender

#### AI Integration
```javascript
async function processMessage(chatId, content, agentId, userId) {
  // Save user message
  const userMessage = await saveMessage(chatId, content, userId, agentId, 'user');
  
  // Generate AI response
  const aiResponse = await generateAIResponse(agentId, content, chatId);
  const assistantMessage = await saveMessage(chatId, aiResponse.content, 'assistant', agentId, 'assistant');
  
  // Broadcast messages to chat room
  broadcastToChat(chatId, {
    type: 'message',
    data: { chatId, message: userMessage },
    timestamp: Date.now()
  });
  
  broadcastToChat(chatId, {
    type: 'message',
    data: { chatId, message: assistantMessage },
    timestamp: Date.now()
  });
}
```

### 3. Chat Room Management

#### Join Chat Room
```javascript
function joinChatRoom(connectionId, chatId) {
  const connection = connections.get(connectionId);
  if (!connection) return;
  
  // Verify user has access to chat
  if (!hasChatAccess(connection.userId, chatId)) {
    sendError(connection.ws, 'Access denied to chat');
    return;
  }
  
  // Add to chat room
  if (!chatRooms.has(chatId)) {
    chatRooms.set(chatId, new Set());
  }
  chatRooms.get(chatId).add(connectionId);
  connection.joinedChats.add(chatId);
  
  // Send chat history
  sendChatHistory(connection.ws, chatId);
}
```

#### Leave Chat Room
```javascript
function leaveChatRoom(connectionId, chatId) {
  const connection = connections.get(connectionId);
  if (!connection) return;
  
  // Remove from chat room
  const chatRoom = chatRooms.get(chatId);
  if (chatRoom) {
    chatRoom.delete(connectionId);
    if (chatRoom.size === 0) {
      chatRooms.delete(chatId);
    }
  }
  
  connection.joinedChats.delete(chatId);
}
```

### 4. Broadcasting

#### Broadcast to Chat Room
```javascript
function broadcastToChat(chatId, message) {
  const chatRoom = chatRooms.get(chatId);
  if (!chatRoom) return;
  
  const messageStr = JSON.stringify(message);
  
  chatRoom.forEach(connectionId => {
    const connection = connections.get(connectionId);
    if (connection && connection.ws.readyState === WebSocket.OPEN) {
      connection.ws.send(messageStr);
    }
  });
}
```

#### Broadcast to User
```javascript
function broadcastToUser(userId, message) {
  const messageStr = JSON.stringify(message);
  
  connections.forEach((connection, connectionId) => {
    if (connection.userId === userId && connection.ws.readyState === WebSocket.OPEN) {
      connection.ws.send(messageStr);
    }
  });
}
```

### 5. Error Handling

#### Connection Errors
```javascript
ws.on('error', (error) => {
  console.error('WebSocket error:', error);
  cleanupConnection(connectionId);
});

ws.on('close', (code, reason) => {
  console.log('WebSocket closed:', code, reason);
  cleanupConnection(connectionId);
});
```

#### Message Validation
```javascript
function validateMessage(message) {
  try {
    const parsed = JSON.parse(message);
    
    if (!parsed.type || !parsed.data || !parsed.timestamp) {
      return { valid: false, error: 'Invalid message format' };
    }
    
    if (!['message', 'typing', 'read_receipt', 'chat_update', 'ping'].includes(parsed.type)) {
      return { valid: false, error: 'Unknown message type' };
    }
    
    return { valid: true, data: parsed };
  } catch (error) {
    return { valid: false, error: 'Invalid JSON' };
  }
}
```

## Database Integration

### Message Storage
```sql
-- Store messages in real-time
INSERT INTO messages (id, chat_id, user_id, agent_id, content, role, timestamp, metadata)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);
```

### Read Receipts
```sql
-- Update message read status
UPDATE messages 
SET metadata = jsonb_set(metadata, '{read}', 'true')
WHERE id = ANY(?) AND chat_id = ?;
```

### Connection Tracking
```sql
-- Track user online status
UPDATE users 
SET last_active = NOW(), is_online = true 
WHERE id = ?;
```

## Security Considerations

### 1. Authentication
- Validate JWT token on connection
- Re-validate token periodically
- Close connection on authentication failure

### 2. Authorization
- Verify user has access to chat before joining
- Validate message permissions
- Prevent unauthorized message sending

### 3. Rate Limiting
```javascript
const rateLimiter = new Map();

function checkRateLimit(userId, messageType) {
  const key = `${userId}:${messageType}`;
  const now = Date.now();
  const limit = rateLimiter.get(key) || { count: 0, resetTime: now + 60000 };
  
  if (now > limit.resetTime) {
    limit.count = 0;
    limit.resetTime = now + 60000;
  }
  
  limit.count++;
  rateLimiter.set(key, limit);
  
  return limit.count <= 100; // 100 messages per minute
}
```

### 4. Input Validation
- Sanitize message content
- Validate message length
- Prevent XSS attacks

## Performance Optimization

### 1. Connection Pooling
- Limit concurrent connections per user
- Implement connection timeouts
- Clean up inactive connections

### 2. Message Batching
```javascript
// Batch multiple messages for efficiency
const messageQueue = new Map();

function queueMessage(chatId, message) {
  if (!messageQueue.has(chatId)) {
    messageQueue.set(chatId, []);
  }
  messageQueue.get(chatId).push(message);
}

// Process queue every 100ms
setInterval(() => {
  messageQueue.forEach((messages, chatId) => {
    if (messages.length > 0) {
      broadcastToChat(chatId, {
        type: 'batch',
        data: { messages },
        timestamp: Date.now()
      });
      messageQueue.set(chatId, []);
    }
  });
}, 100);
```

### 3. Memory Management
- Limit message history in memory
- Implement message pagination
- Clean up old connections

## Monitoring and Logging

### 1. Connection Metrics
```javascript
const metrics = {
  totalConnections: 0,
  activeChats: 0,
  messagesPerSecond: 0,
  errors: 0
};

// Update metrics
setInterval(() => {
  metrics.totalConnections = connections.size;
  metrics.activeChats = chatRooms.size;
  console.log('WebSocket Metrics:', metrics);
}, 5000);
```

### 2. Error Logging
```javascript
function logError(error, context) {
  console.error('WebSocket Error:', {
    error: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
}
```

## Testing Requirements

### 1. Unit Tests
- Message validation
- Authentication
- Chat room management
- Broadcasting

### 2. Integration Tests
- End-to-end message flow
- AI integration
- Database operations
- Error handling

### 3. Load Tests
- Concurrent connections
- Message throughput
- Memory usage
- Connection stability

## Deployment Considerations

### 1. Production Setup
- Use WSS (secure WebSocket)
- Implement SSL/TLS
- Set up load balancing
- Configure auto-scaling

### 2. Environment Variables
```env
WS_PORT=3001
WS_PATH=/ws
JWT_SECRET=your-secret-key
MAX_CONNECTIONS=10000
MESSAGE_RATE_LIMIT=100
```

### 3. Health Checks
```javascript
// Health check endpoint
app.get('/ws/health', (req, res) => {
  res.json({
    status: 'healthy',
    connections: connections.size,
    activeChats: chatRooms.size,
    uptime: process.uptime()
  });
});
```

This specification provides a comprehensive foundation for implementing a robust WebSocket server that can handle real-time chat functionality with proper security, performance, and scalability considerations. 