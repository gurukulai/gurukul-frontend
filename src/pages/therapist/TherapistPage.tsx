
'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AI_AGENTS } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { Brain, MessageCircle, Heart, Shield, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const TherapistPage = () => {
  const { user, login } = useAuth();
  const { createNewChat } = useChat();
  const navigate = useNavigate();
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
      navigate(`/therapist/chat/${chatId}`);
    } catch (error) {
      console.error('Failed to start chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Heart,
      title: "Empathetic Support",
      description: "Compassionate AI guruji trained to understand and respond to your emotional needs"
    },
    {
      icon: Shield,
      title: "Safe Space",
      description: "Confidential environment where you can express yourself freely"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Always here when you need someone to talk to, any time of day"
    },
    {
      icon: Users,
      title: "Cultural Understanding",
      description: "Aware of Indian cultural context and family dynamics"
    }
  ];

  const specialties = [
    "Anxiety & Stress",
    "Depression",
    "Relationship Issues",
    "Family Problems",
    "Work Stress",
    "Self-Esteem",
    "Grief & Loss",
    "Life Transitions"
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
              Mental Health Guru
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your compassionate mental wellness guruji, ready to listen, understand, 
              and guide you through life's challenges with empathy and wisdom.
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
                <Link to="/therapist/history">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Mental Health Support</h2>
            <p className="text-xl text-gray-600">Evidence-based therapeutic approaches adapted for AI</p>
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

      {/* Specialties Section - Updated with light background */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What I Can Help With</h2>
              <p className="text-xl text-gray-600">Specialized support for various mental health concerns</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {specialties.map((specialty, index) => (
                <div 
                  key={index}
                  className="bg-white/70 backdrop-blur-sm border border-therapist-200 rounded-lg p-4 text-center hover:bg-therapist-50 transition-colors shadow-sm"
                >
                  <span className="text-therapist-700 font-medium">{specialty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-therapist-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Healing Journey?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Take the first step towards better mental health with compassionate AI guruji support.
          </p>
          
          <Button 
            size="lg" 
            variant="secondary"
            onClick={handleStartChat}
            disabled={isLoading}
            className="px-8 py-4 text-lg"
          >
            {isLoading ? 'Starting...' : 'Begin Session'}
            <MessageCircle className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default TherapistPage;
