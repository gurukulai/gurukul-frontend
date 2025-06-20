
'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AI_AGENTS } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { Briefcase, MessageCircle, Target, TrendingUp, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const CareerPage = () => {
  const { user, login } = useAuth();
  const { createNewChat } = useChat();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const agent = AI_AGENTS.CAREER;

  const handleStartChat = async () => {
    if (!user) {
      await login();
      return;
    }

    setIsLoading(true);
    try {
      const chatId = await createNewChat(agent.id);
      navigate(`/career/chat/${chatId}`);
    } catch (error) {
      console.error('Failed to start chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Target,
      title: "Career Planning",
      description: "Strategic guidance for your professional journey and goal setting"
    },
    {
      icon: TrendingUp,
      title: "Skill Assessment",
      description: "Identify your strengths and areas for improvement in your career"
    },
    {
      icon: Users,
      title: "Interview Preparation",
      description: "Practice interviews and get tips for landing your dream job"
    },
    {
      icon: Clock,
      title: "Market Insights",
      description: "Stay updated with industry trends and job market dynamics"
    }
  ];

  const specialties = [
    "Career Transition",
    "Interview Prep",
    "Resume Building",
    "Skill Development",
    "Salary Negotiation",
    "Leadership Skills",
    "Networking Tips",
    "Work-Life Balance"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-career-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-career-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Career Guru
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your professional development guruji, ready to navigate your career path with 
              personalized guidance, skill assessments, and job market insights - your success mentor!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg" 
                onClick={handleStartChat}
                disabled={isLoading}
                className="bg-career-500 hover:bg-career-600 text-white px-8 py-4 text-lg"
              >
                {isLoading ? 'Starting...' : 'Start Career Consultation'}
                <MessageCircle className="ml-2 h-5 w-5" />
              </Button>
              
              {user && (
                <Link to="/career/history">
                  <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-career-500 text-career-500">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Growth Support</h2>
            <p className="text-xl text-gray-600">Strategic career guidance tailored for Indian professionals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-career-500 rounded-full flex items-center justify-center mx-auto mb-4">
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">My Expertise Areas</h2>
              <p className="text-xl text-gray-600">Comprehensive career guidance across all professional aspects</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {specialties.map((specialty, index) => (
                <div 
                  key={index}
                  className="bg-white/70 backdrop-blur-sm border border-career-200 rounded-lg p-4 text-center hover:bg-career-50 transition-colors shadow-sm"
                >
                  <span className="text-career-700 font-medium">{specialty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-career-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Accelerate Your Career?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Take the next step in your professional journey with personalized career guidance and strategic planning.
          </p>
          
          <Button 
            size="lg" 
            variant="secondary"
            onClick={handleStartChat}
            disabled={isLoading}
            className="px-8 py-4 text-lg"
          >
            {isLoading ? 'Starting...' : 'Get Career Guidance'}
            <MessageCircle className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CareerPage;
