'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AI_AGENTS } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { MessageCircle, Heart, Sparkles, Book, Music, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

const PriyaPage = () => {
  const { user, login } = useAuth();
  const { createNewChat } = useChat();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const agent = AI_AGENTS.PRIYA;

  const handleStartChat = async () => {
    if (!user) {
      await login();
      return;
    }

    setIsLoading(true);
    try {
      const chatId = await createNewChat(agent.id);
      navigate(`/priya/chat/${chatId}`);
    } catch (error) {
      console.error('Failed to start chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: MessageCircle,
      title: "Friendly Conversations",
      description: "Chat about anything and everything in a warm, supportive environment"
    },
    {
      icon: Book,
      title: "Learning Support",
      description: "Help with studies, explanations, and educational guidance"
    },
    {
      icon: Sparkles,
      title: "Creative Assistance",
      description: "Support with creative projects, writing, and brainstorming"
    },
    {
      icon: Coffee,
      title: "Daily Companion",
      description: "Your friendly AI companion for everyday conversations and support"
    }
  ];

  const topics = [
    "General Chat",
    "Study Help",
    "Creative Writing",
    "Life Advice",
    "Entertainment",
    "Technology",
    "Culture & Arts",
    "Daily Planning"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-priya-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-priya-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">👩</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Hi, I'm Priya!
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your friendly AI companion! I'm here to chat, help with your daily tasks, 
              answer questions, and be your supportive digital friend.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg" 
                onClick={handleStartChat}
                disabled={isLoading}
                className="bg-priya-500 hover:bg-priya-600 text-white px-8 py-4 text-lg"
              >
                {isLoading ? 'Starting...' : 'Start Chatting with Priya'}
                <Heart className="ml-2 h-5 w-5" />
              </Button>
              
              {user && (
                <Link to="/priya/history">
                  <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-priya-500 text-priya-500">
                    View Chat History
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Makes Me Special</h2>
            <p className="text-xl text-gray-600">Your versatile AI friend for all occasions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-priya-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Can Talk About</h2>
              <p className="text-xl text-gray-600">I love chatting about all sorts of topics!</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {topics.map((topic, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="p-3 text-center justify-center bg-priya-50 text-priya-700 hover:bg-priya-100 transition-colors"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-priya-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Let's Be Friends!
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            I'm excited to meet you and be your AI companion. Let's start a wonderful conversation!
          </p>
          
          <Button 
            size="lg" 
            variant="secondary"
            onClick={handleStartChat}
            disabled={isLoading}
            className="px-8 py-4 text-lg"
          >
            {isLoading ? 'Starting...' : 'Chat with Priya'}
            <Heart className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default PriyaPage;
