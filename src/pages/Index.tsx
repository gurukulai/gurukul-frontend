
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AI_AGENTS } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Brain, 
  Apple, 
  Briefcase, 
  MessageCircle, 
  Shield, 
  Zap, 
  Heart,
  Users,
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const HomePage = () => {
  const { user, login } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const agentIcons = {
    therapist: Brain,
    dietician: Apple,
    career: Briefcase,
    priya: MessageCircle
  };

  const features = [
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your conversations are encrypted and your privacy is our priority"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get responses in 3-5 seconds with our optimized AI models"
    },
    {
      icon: Heart,
      title: "Made for India",
      description: "Culturally aware AI that understands Indian context and values"
    },
    {
      icon: Users,
      title: "24/7 Available",
      description: "Your AI companions are always ready to help, anytime, anywhere"
    }
  ];

  const stats = [
    { label: "Active Users", value: "10K+", icon: Users },
    { label: "Conversations", value: "50K+", icon: MessageCircle },
    { label: "Success Rate", value: "95%", icon: Award },
    { label: "Response Time", value: "3s", icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-orange-500/5 to-red-500/5" />
        <div className="relative container mx-auto px-4 py-20">
          <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI for Bharat</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Meet Your Personal
              <span className="block gradient-text">AI Companions</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your life with AI-powered guidance for mental health, nutrition, 
              career development, and everyday conversations - all in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              {user ? (
                <Link href="/therapist">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white px-8 py-4 text-lg">
                    Start Chatting
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Button 
                  size="lg" 
                  onClick={login}
                  className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white px-8 py-4 text-lg"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
              
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your
              <span className="gradient-text"> AI Companion</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each AI agent is specially trained to provide expert guidance in their domain, 
              understanding your unique needs and cultural context.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.values(AI_AGENTS).map((agent, index) => {
              const IconComponent = agentIcons[agent.id as keyof typeof agentIcons];
              
              return (
                <Card 
                  key={agent.id} 
                  className={`group hover:shadow-xl transition-all duration-300 border-2 hover:border-opacity-50 ${agent.bgGradient} hover:-translate-y-2`}
                  style={{ borderColor: `${agent.primaryColor}30` }}
                >
                  <CardHeader className="text-center pb-4">
                    <div 
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl"
                      style={{ backgroundColor: agent.primaryColor }}
                    >
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-xl mb-2">{agent.name}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {agent.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {agent.features.map((feature) => (
                        <Badge 
                          key={feature} 
                          variant="secondary" 
                          className="text-xs"
                          style={{ 
                            backgroundColor: `${agent.primaryColor}15`,
                            color: agent.primaryColor
                          }}
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    
                    <Link href={agent.route}>
                      <Button 
                        className="w-full text-white group-hover:shadow-lg transition-all"
                        style={{ backgroundColor: agent.primaryColor }}
                      >
                        Start Conversation
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose
              <span className="gradient-text"> Gurukul AI?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with cutting-edge AI technology and deep understanding of Indian culture and values.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-orange-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join thousands of Indians who are already benefiting from personalized AI guidance.
          </p>
          
          {user ? (
            <Link href="/therapist">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Button 
              size="lg" 
              variant="secondary"
              onClick={login}
              className="px-8 py-4 text-lg"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
