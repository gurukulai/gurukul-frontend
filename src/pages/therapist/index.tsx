
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AI_AGENTS } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { Brain, MessageCircle, Clock, Shield, Heart, Users } from 'lucide-react';
import Link from 'next/link';

const TherapistPage = () => {
  const { user, login } = useAuth();
  const { createNewChat } = useChat();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const agent = AI_AGENTS.THERAPIST;

  const handleStartChat = async () => {
    if (!user) {
      await login();
      return;
    }

    setIsLoading(true);
    try {
      const chatId = await createNewChat(agent.id);
      router.push(`/therapist/chat/${chatId}`);
    } catch (error) {
      console.error('Failed to start chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Brain,
      title: "Cognitive Behavioral Therapy",
      description: "Evidence-based CBT techniques to help you manage thoughts and emotions"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Get support whenever you need it, day or night"
    },
    {
      icon: Shield,
      title: "Complete Privacy",
      description: "Your conversations are secure and confidential"
    },
    {
      icon: Heart,
      title: "Emotional Support",
      description: "Compassionate AI trained to understand and validate your feelings"
    }
  ];

  const topics = [
    "Anxiety & Stress Management",
    "Depression Support",
    "Relationship Issues",
    "Work-Life Balance",
    "Self-Esteem Building",
    "Grief & Loss",
    "Sleep Problems",
    "Mindfulness & Meditation"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapist-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-therapist-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              AI Therapist
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your compassionate mental health companion, available 24/7 to provide support, 
              guidance, and evidence-based therapeutic techniques.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg" 
                onClick={handleStartChat}
                disabled={isLoading}
                className="bg-therapist-500 hover:bg-therapist-600 text-white px-8 py-4 text-lg"
              >
                {isLoading ? 'Starting...' : 'Start Therapy Session'}
                <MessageCircle className="ml-2 h-5 w-5" />
              </Button>
              
              {user && (
                <Link href="/therapist/history">
                  <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-therapist-500 text-therapist-500">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How AI Therapy Works</h2>
            <p className="text-xl text-gray-600">Professional therapeutic support powered by AI</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-therapist-500 rounded-full flex items-center justify-center mx-auto mb-4">
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Can Discuss</h2>
              <p className="text-xl text-gray-600">I'm here to help with a wide range of mental health topics</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {topics.map((topic, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="p-3 text-center justify-center bg-therapist-50 text-therapist-700 hover:bg-therapist-100 transition-colors"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-therapist-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Mental Health Journey?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Take the first step towards better mental health. I'm here to listen, understand, and guide you.
          </p>
          
          <Button 
            size="lg" 
            variant="secondary"
            onClick={handleStartChat}
            disabled={isLoading}
            className="px-8 py-4 text-lg"
          >
            {isLoading ? 'Starting...' : 'Begin Your Session'}
            <MessageCircle className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default TherapistPage;
