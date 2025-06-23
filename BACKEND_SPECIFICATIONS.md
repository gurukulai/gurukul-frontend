# Backend API Specifications for Gurukul Chat System

## Overview
This document outlines the backend API requirements for the Gurukul Frontend chat system. The backend should provide RESTful APIs for chat management, message handling, and real-time communication.

## Base Configuration
- **Base URL**: `http://localhost:3001/api` (configurable via `VITE_API_BASE_URL`)
- **Content-Type**: `application/json`
- **Authentication**: Bearer token in Authorization header

## Authentication
All endpoints require authentication except where noted. Include the JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  createdAt: Date;
  lastActive: Date;
}
```

### Message
```typescript
interface Message {
  id: string;
  chatId: string;
  userId: string;
  agentId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  metadata?: {
    messageIndex?: number;
    totalMessages?: number;
    confidence?: number;
    read?: boolean;
  };
}
```

### Chat
```typescript
interface Chat {
  id: string;
  userId: string;
  agentId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  lastMessage?: string;
}
```

### ChatSession
```typescript
interface ChatSession {
  chatId: string;
  messages: Message[];
  isLoading: boolean;
  hasNewMessages: boolean;
  pollCount: number;
}
```

### API Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  messages?: Message[];
  hasMore?: boolean;
}
```

## API Endpoints

### 1. Get All Chats
**GET** `/chats`

Returns all chats for the authenticated user.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "chat-123",
      "userId": "user-456",
      "agentId": "therapist",
      "title": "Mental Health Session",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T11:45:00Z",
      "messageCount": 15,
      "lastMessage": "How are you feeling today?"
    }
  ]
}
```

### 2. Get Specific Chat
**GET** `/chats/:chatId`

Returns a specific chat with all its messages.

**Response:**
```json
{
  "success": true,
  "data": {
    "chatId": "chat-123",
    "messages": [
      {
        "id": "msg-789",
        "chatId": "chat-123",
        "userId": "user-456",
        "agentId": "therapist",
        "content": "Hello, how can I help you today?",
        "role": "assistant",
        "timestamp": "2024-01-15T10:30:00Z",
        "metadata": {
          "confidence": 0.95,
          "read": true
        }
      }
    ],
    "isLoading": false,
    "hasNewMessages": false,
    "pollCount": 0
  }
}
```

### 3. Create New Chat
**POST** `/chats`

Creates a new chat session.

**Request Body:**
```json
{
  "agentId": "therapist"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "chat-123",
    "userId": "user-456",
    "agentId": "therapist",
    "title": "New therapist chat",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "messageCount": 0
  }
}
```

### 4. Send Message
**POST** `/chats/:chatId/messages`

Sends a message to a specific chat. The backend should:
1. Save the user message
2. Process the message with the appropriate AI agent
3. Generate and save the AI response
4. Return the complete message object

**Request Body:**
```json
{
  "content": "I'm feeling anxious today",
  "agentId": "therapist"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "msg-789",
    "chatId": "chat-123",
    "userId": "assistant",
    "agentId": "therapist",
    "content": "I understand you're feeling anxious. Let's explore this together. Can you tell me more about what's causing this anxiety?",
    "role": "assistant",
    "timestamp": "2024-01-15T10:31:00Z",
    "metadata": {
      "confidence": 0.92,
      "messageIndex": 1,
      "totalMessages": 1
    }
  }
}
```

### 5. Get Messages (with Pagination)
**GET** `/chats/:chatId/messages?page=1&limit=50`

Returns paginated messages for a chat.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Messages per page (default: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [...],
    "hasMore": true,
    "total": 150
  }
}
```

### 6. Poll for New Messages
**GET** `/chats/:chatId/messages/poll?lastMessageId=msg-789`

Returns new messages since the last message ID. Used for real-time updates.

**Query Parameters:**
- `lastMessageId`: ID of the last message received (optional)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "msg-790",
      "chatId": "chat-123",
      "userId": "assistant",
      "agentId": "therapist",
      "content": "I'm here to support you through this.",
      "role": "assistant",
      "timestamp": "2024-01-15T10:32:00Z"
    }
  ]
}
```

### 7. Update Chat Title
**PATCH** `/chats/:chatId`

Updates the title of a chat.

**Request Body:**
```json
{
  "title": "Updated Chat Title"
}
```

**Response:**
```json
{
  "success": true
}
```

### 8. Delete Chat
**DELETE** `/chats/:chatId`

Deletes a chat and all its messages.

**Response:**
```json
{
  "success": true
}
```

### 9. Mark Messages as Read
**POST** `/chats/:chatId/messages/read`

Marks specific messages as read.

**Request Body:**
```json
{
  "messageIds": ["msg-789", "msg-790"]
}
```

**Response:**
```json
{
  "success": true
}
```

## AI Agent Integration

### Supported Agents
- `therapist`: Mental health and therapy conversations
- `dietician`: Nutrition and dietary advice
- `career`: Career guidance and professional development
- `priya`: General conversation and assistance

### Agent Response Requirements
1. **Context Awareness**: Each agent should maintain conversation context
2. **Response Quality**: Responses should be helpful, empathetic, and relevant
3. **Response Time**: Aim for responses within 2-5 seconds
4. **Message Metadata**: Include confidence scores and message indexing
5. **Cultural Sensitivity**: Responses should be culturally appropriate for Indian users

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": "Error message description"
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created (for new resources)
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Real-time Features

### Polling Configuration
- **Polling Interval**: 2 seconds (configurable)
- **Polling Endpoint**: `/chats/:chatId/messages/poll`
- **Efficient Polling**: Only return new messages since last poll

### WebSocket Alternative (Optional)
For better real-time performance, consider implementing WebSocket support:
- **WebSocket URL**: `ws://localhost:3001/ws`
- **Events**: `message`, `typing`, `read_receipt`

## Security Requirements

### Authentication
- JWT-based authentication
- Token expiration and refresh mechanism
- Secure token storage

### Authorization
- Users can only access their own chats
- Validate user ownership for all chat operations
- Rate limiting for message sending

### Data Protection
- Encrypt sensitive message content
- Implement proper input validation
- Sanitize user inputs to prevent XSS

## Performance Requirements

### Response Times
- Chat list: < 500ms
- Message sending: < 3s
- Message polling: < 1s
- Chat loading: < 1s

### Scalability
- Support concurrent users
- Database indexing for efficient queries
- Message pagination for large conversations

## Database Schema (Recommended)

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  picture TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Chats Table
```sql
CREATE TABLE chats (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  agent_id VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  message_count INTEGER DEFAULT 0,
  last_message TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id VARCHAR(255) PRIMARY KEY,
  chat_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  agent_id VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  role ENUM('user', 'assistant') NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSON,
  FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Environment Variables

### Required Environment Variables
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/gurukul_db

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# AI Service (if using external AI)
OPENAI_API_KEY=your-openai-api-key
# or
ANTHROPIC_API_KEY=your-anthropic-api-key

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Testing Requirements

### API Testing
- Unit tests for all endpoints
- Integration tests for chat workflows
- Load testing for concurrent users
- Error handling tests

### Test Coverage
- All endpoints should have >90% test coverage
- Include authentication and authorization tests
- Test error scenarios and edge cases

## Deployment Considerations

### Production Setup
- Use HTTPS in production
- Implement proper logging and monitoring
- Set up database backups
- Configure rate limiting
- Use environment-specific configurations

### Monitoring
- API response times
- Error rates
- Database performance
- Memory usage
- User activity metrics

## Implementation Notes

1. **Message Processing**: Implement async message processing for AI responses
2. **Caching**: Consider Redis for session management and caching
3. **File Uploads**: If supporting file uploads, implement proper storage
4. **Analytics**: Track user interactions for improving AI responses
5. **Backup**: Regular database backups for message history
6. **Compliance**: Ensure compliance with data protection regulations

This specification provides a comprehensive foundation for building a robust backend that can handle the Gurukul chat system's requirements while maintaining security, performance, and scalability. 