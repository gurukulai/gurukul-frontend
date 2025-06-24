
# Gurukul AI - AI for India

A comprehensive AI-powered platform providing personalized assistance for mental health, nutrition, career guidance, and general conversations. Built with Next.js, TypeScript, and Tailwind CSS.

## 🌟 Features

### AI Agents
- **🧠 AI Therapist**: Mental health support with CBT techniques
- **🥗 AI Dietician**: Personalized nutrition and meal planning
- **💼 Career Guide**: Professional development and job guidance  
- **👩 Priya**: General purpose AI companion

### Core Features
- **Progressive Web App (PWA)** with offline capabilities
- **Google Authentication** for secure login
- **Real-time Chat** with typing indicators
- **Mobile-first** responsive design
- **Chat History** persistence
- **Agent-specific** UI themes and colors
- **Message Polling** for backend responses
- **Cultural Context** awareness for Indian users

## 🚀 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui, Radix UI
- **Authentication**: Google OAuth (to be implemented)
- **State Management**: React Context API
- **Styling**: Tailwind CSS with custom themes
- **Icons**: Lucide React
- **PWA**: next-pwa

## 📱 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd gurukul-ai-sadhana

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### PWA Setup
The app is configured as a Progressive Web App with:
- Service worker for offline functionality
- App manifest for installability
- Optimized caching strategies
- Push notification ready

## 🔧 Backend API Requirements

The frontend expects the following API endpoints:

### Authentication APIs
```typescript
// POST /api/auth/login
// Google OAuth login
{
  "token": "google_oauth_token"
}

// Response
{
  "success": true,
  "user": {
    "id": "string",
    "email": "string", 
    "name": "string",
    "picture": "string"
  },
  "token": "jwt_token"
}

// GET /api/auth/me
// Get current user
// Headers: Authorization: Bearer {jwt_token}
// Response: User object

// POST /api/auth/logout
// Logout user
// Headers: Authorization: Bearer {jwt_token}
```

### Chat APIs
```typescript
// POST /api/chat
// Create new chat or send message
{
  "agentId": "therapist" | "dietician" | "career" | "priya",
  "content": "string", // message content
  "chatId": "string" // optional, for existing chat
}

// Response
{
  "success": true,
  "chatId": "string",
  "messages": [
    {
      "id": "string",
      "content": "string",
      "role": "assistant",
      "timestamp": "ISO string",
      "metadata": {
        "confidence": 0.95,
        "messageIndex": 1,
        "totalMessages": 2
      }
    }
  ]
}

// GET /api/chat/{chatId}/messages
// Get messages for a chat
// Headers: Authorization: Bearer {jwt_token}
// Response: Array of messages

// GET /api/chat/history
// Get user's chat history
// Headers: Authorization: Bearer {jwt_token}
// Response: Array of chat summaries
```

### Message Polling
The frontend polls for new messages every 2 seconds using:
```typescript
// GET /api/chat/{chatId}/poll
// Headers: Authorization: Bearer {jwt_token}
// Query: ?lastMessageId=string&timeout=30000

// Response
{
  "success": true,
  "hasNewMessages": boolean,
  "messages": Message[],
  "isTyping": boolean
}
```

## 🎨 Design System

### Color Themes (Agent-specific)
- **Therapist**: Blue (#0ea5e9)
- **Dietician**: Green (#22c55e)  
- **Career**: Orange (#f59e0b)
- **Priya**: Pink (#ec4899)

### Typography
- **Headings**: Poppins (Google Fonts)
- **Body**: Inter (Google Fonts)

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔐 Environment Variables

```env
# Google OAuth (Required)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Database (if using)
DATABASE_URL=your_database_url

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## 📊 Backend Requirements

### Database Schema
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  picture VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW()
);

-- Chats table  
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  agent_id VARCHAR NOT NULL,
  title VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  message_count INTEGER DEFAULT 0
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES chats(id),
  user_id UUID REFERENCES users(id),
  agent_id VARCHAR NOT NULL,
  content TEXT NOT NULL,
  role VARCHAR NOT NULL CHECK (role IN ('user', 'assistant')),
  timestamp TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);
```

### AI Model Requirements
- **Response Time**: 3-5 seconds maximum
- **Multiple Messages**: Support returning 1-5 messages per request
- **Context Awareness**: Maintain conversation context
- **Cultural Sensitivity**: Understand Indian context and values
- **Safety**: Content filtering and appropriate responses

### Recommended Tech Stack (Backend)
- **API**: FastAPI or Express.js
- **Database**: PostgreSQL with pgvector for embeddings
- **AI**: OpenAI GPT-4 or Anthropic Claude
- **Authentication**: JWT with Google OAuth
- **Deployment**: Docker + Cloud (AWS/GCP/Azure)

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Setup
1. Set up Google OAuth credentials
2. Configure database connection
3. Set up AI API keys (OpenAI, etc.)
4. Configure environment variables

## 📱 PWA Installation

Users can install the app on their devices:
1. Visit the website
2. Click "Add to Home Screen" (mobile)
3. Or "Install App" (desktop)

## 🔒 Security Features

- **HTTPS Only**: All communications encrypted
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: All user inputs sanitized
- **Rate Limiting**: Prevent abuse
- **Data Privacy**: GDPR compliant

## 🎯 Performance Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Caching**: Service worker + API caching
- **Bundle Analysis**: `npm run analyze`

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📈 Analytics & Monitoring

- **Performance**: Core Web Vitals tracking
- **Usage**: User interaction analytics
- **Errors**: Error boundary with reporting
- **Health**: API endpoint monitoring

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.gurukul.ai](https://docs.gurukul.ai)
- **Discord**: [Join our community](https://discord.gg/gurukul)
- **Email**: support@gurukul.ai

---

**Made with ❤️ for India** 🇮🇳
