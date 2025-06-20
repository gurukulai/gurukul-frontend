
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AI_AGENTS } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { Briefcase, MessageCircle, TrendingUp, Users, Target, BookOpen } from 'lucide-react';
import Link from 'next/link';

const CareerPage = () => {
  const { user, login } = useAuth();
  const { createNewChat } = useChat();
  const router = useRouter();
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
      router.push(`/career/chat/${chatId}`);
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
      description: "Strategic career roadmaps tailored to your goals and skills"
    },
    {
      icon: TrendingUp,
      title: "Skill Assessment",
      description: "Identify your strengths and areas for professional development"
    },
    {
      icon: Users,
      title: "Interview Preparation", 
      description: "Mock interviews and tips to ace your next job interview"
    },
    {
      icon: BookOpen,
      title: "Market Insights",
      description: "Stay updated with industry trends and job market analysis"
    }
  ];

  const services = [
    "Resume Review",
    "Interview Preparation",
    "Career Transition",
    "Skill Development",
    "Salary Negotiation",
    "LinkedIn Optimization",
    "Industry Analysis",
    "Job Search Strategy"
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
              AI Career Guide
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your professional development mentor. Get personalized career guidance, 
              skill assessments, and strategic advice to accelerate your career growth.
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
                <Link href="/career/history">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Career Support</h2>
            <p className="text-xl text-gray-600">Comprehensive career development assistance</p>
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

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What I Can Help With</h2>
              <p className="text-xl text-gray-600">Comprehensive career development services</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {services.map((service, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="p-3 text-center justify-center bg-career-50 text-career-700 hover:bg-career-100 transition-colors"
                >
                  {service}
                </Badge>
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
            Take the next step in your professional journey with personalized career guidance.
          </p>
          
          <Button 
            size="lg" 
            variant="secondary"
            onClick={handleStartChat}
            disabled={isLoading}
            className="px-8 py-4 text-lg"
          >
            {isLoading ? 'Starting...' : 'Get Career Advice'}
            <MessageCircle className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CareerPage;
