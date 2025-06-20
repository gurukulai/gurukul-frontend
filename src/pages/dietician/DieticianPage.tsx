
'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AI_AGENTS } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { Apple, MessageCircle, Utensils, TrendingUp, Heart, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const DieticianPage = () => {
  const { user, login } = useAuth();
  const { createNewChat } = useChat();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const agent = AI_AGENTS.DIETICIAN;

  const handleStartChat = async () => {
    if (!user) {
      await login();
      return;
    }

    setIsLoading(true);
    try {
      const chatId = await createNewChat(agent.id);
      navigate(`/dietician/chat/${chatId}`);
    } catch (error) {
      console.error('Failed to start chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Utensils,
      title: "Personalized Meal Plans",
      description: "Custom meal plans based on your dietary preferences and health goals"
    },
    {
      icon: TrendingUp,
      title: "Nutrition Tracking",
      description: "Monitor your daily nutrition intake and track progress"
    },
    {
      icon: Heart,
      title: "Health-Focused",
      description: "Recommendations based on your health conditions and goals"
    },
    {
      icon: Clock,
      title: "Instant Guidance",
      description: "Get immediate answers to your nutrition questions"
    }
  ];

  const specialties = [
    "Weight Management",
    "Diabetes Care",
    "Heart Health",
    "Desi Cuisine",
    "Vegetarian/Vegan",
    "Sports Nutrition",
    "Pregnancy Nutrition",
    "Child Nutrition"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dietician-50 to-green-50">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-dietician-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Apple className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Nutrition Guru
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your personalized nutrition guruji, ready to create meal plans, 
              track your health goals, and guide you towards better eating habits with desi wisdom.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg" 
                onClick={handleStartChat}
                disabled={isLoading}
                className="bg-dietician-500 hover:bg-dietician-600 text-white px-8 py-4 text-lg"
              >
                {isLoading ? 'Starting...' : 'Start Nutrition Consultation'}
                <MessageCircle className="ml-2 h-5 w-5" />
              </Button>
              
              {user && (
                <Link to="/dietician/history">
                  <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-dietician-500 text-dietician-500">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Personalized Nutrition Support</h2>
            <p className="text-xl text-gray-600">Science-backed nutrition guidance tailored for Indian lifestyle</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-dietician-500 rounded-full flex items-center justify-center mx-auto mb-4">
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">My Specialties</h2>
              <p className="text-xl text-gray-600">Expert guidance across various nutrition areas</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {specialties.map((specialty, index) => (
                <div 
                  key={index}
                  className="bg-white/70 backdrop-blur-sm border border-dietician-200 rounded-lg p-4 text-center hover:bg-dietician-50 transition-colors shadow-sm"
                >
                  <span className="text-dietician-700 font-medium">{specialty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-dietician-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Health?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Start your journey to better nutrition and healthier living with personalized desi guidance.
          </p>
          
          <Button 
            size="lg" 
            variant="secondary"
            onClick={handleStartChat}
            disabled={isLoading}
            className="px-8 py-4 text-lg"
          >
            {isLoading ? 'Starting...' : 'Get Nutrition Advice'}
            <MessageCircle className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default DieticianPage;
