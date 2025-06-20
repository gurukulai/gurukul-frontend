
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AI_AGENTS } from '@/lib/constants';
import { MessageCircle, Calendar, Plus, Brain, Apple, Briefcase, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const MyChatsPage = () => {
  const { user } = useAuth();
  const { chats } = useChat();
  const navigate = useNavigate();

  const getAgentIcon = (agentId: string) => {
    switch (agentId) {
      case 'therapist':
        return Brain;
      case 'dietician':
        return Apple;
      case 'career':
        return Briefcase;
      case 'priya':
        return () => <span className="text-lg">👩</span>;
      default:
        return MessageCircle;
    }
  };

  const getAgentColor = (agentId: string) => {
    const agent = Object.values(AI_AGENTS).find(a => a.id === agentId);
    return agent?.primaryColor || '#6B7280';
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">You need to be signed in to view your chats.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Chats</h1>
              <p className="text-gray-600">View and manage your conversations with AI agents</p>
            </div>
            <div className="flex space-x-4">
              <Link to="/therapist">
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  New Chat
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Object.values(AI_AGENTS).map((agent) => {
              const IconComponent = getAgentIcon(agent.id);
              return (
                <Link key={agent.id} to={agent.route}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div 
                        className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                        style={{ backgroundColor: agent.primaryColor }}
                      >
                        {agent.id === 'priya' ? (
                          <span className="text-2xl">👩</span>
                        ) : (
                          <IconComponent className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <h3 className="font-semibold text-sm">{agent.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">Start new chat</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Chat History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Recent Conversations
              </CardTitle>
              <CardDescription>
                Your chat history with AI agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chats.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No chats yet</h3>
                  <p className="text-gray-500 mb-6">Start a conversation with one of our AI agents</p>
                  <Link to="/therapist">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Start Your First Chat
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {chats.map((chat) => {
                    const agent = Object.values(AI_AGENTS).find(a => a.id === chat.agentId);
                    const IconComponent = getAgentIcon(chat.agentId);
                    
                    return (
                      <Link 
                        key={chat.id} 
                        to={`/${chat.agentId}/chat/${chat.id}`}
                        className="block"
                      >
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div 
                                  className="w-10 h-10 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: getAgentColor(chat.agentId) }}
                                >
                                  {chat.agentId === 'priya' ? (
                                    <span className="text-lg">👩</span>
                                  ) : (
                                    <IconComponent className="w-5 h-5 text-white" />
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-semibold">{chat.title}</h3>
                                  <p className="text-sm text-gray-600">
                                    {chat.lastMessage || 'No messages yet'}
                                  </p>
                                  <div className="flex items-center space-x-4 mt-1">
                                    <Badge 
                                      variant="secondary"
                                      style={{ 
                                        backgroundColor: `${getAgentColor(chat.agentId)}15`,
                                        color: getAgentColor(chat.agentId)
                                      }}
                                    >
                                      {agent?.name || chat.agentId}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {chat.messageCount} messages
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center text-xs text-gray-500 mb-1">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {new Date(chat.updatedAt).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {new Date(chat.updatedAt).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyChatsPage;
