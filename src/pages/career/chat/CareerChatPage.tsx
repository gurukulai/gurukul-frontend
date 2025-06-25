'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AI_AGENTS } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { MessageBubble } from '@/components/Chat/MessageBubble';
import { ChatInput } from '@/components/Chat/ChatInput';
import { TypingIndicator } from '@/components/Chat/TypingIndicator';
import { ArrowLeft, Briefcase, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

const CareerChatPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentChat, sendMessage, loadChat, isTyping, error } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const agent = AI_AGENTS.CAREER;

  useEffect(() => {
    if (chatId) {
      loadChatData(chatId);
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages, isTyping]);

  const loadChatData = async (id: string) => {
    try {
      await loadChat(id);
    } catch (error) {
      console.error('Failed to load chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message: string) => {
    if (currentChat?.chatId) {
      await sendMessage(message, agent.id, currentChat.chatId);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-career-50">
        <Card className="p-8 text-center">
          <Briefcase className="w-12 h-12 text-career-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">You need to be signed in to access career consultations.</p>
          <Link to="/career">
            <Button className="bg-career-500 hover:bg-career-600">
              Go Back
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-career-50">
        <div className="text-center">
          <Briefcase className="w-12 h-12 text-career-500 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading your career consultation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-career-50">
      {/* Header */}
      <div className="bg-white border-b border-career-200 sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/career">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-career-500 rounded-full flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-lg">{agent.name}</h1>
                  <p className="text-sm text-gray-500">Your Career Development Guide</p>
                </div>
              </div>
            </div>

            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Welcome Message */}
              {(!currentChat?.messages || currentChat.messages.length === 0) && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-career-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Welcome to Your Career Consultation</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    I'm here to help you advance your career, from skill development to job search strategies. 
                    What career goals would you like to discuss today?
                  </p>
                </div>
              )}

              {/* Messages */}
              {currentChat?.messages.map((message) => (
                <MessageBubble 
                  key={message.id} 
                  message={message} 
                  agentConfig={agent}
                />
              ))}

              {/* Typing Indicator */}
              {isTyping && <TypingIndicator />}
              
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={false}
              placeholder="Ask about career development, job search, or skills..."
              agentColor={agent.primaryColor}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CareerChatPage;
