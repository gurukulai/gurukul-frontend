
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Calendar, MessageCircle, User, Heart, Lightbulb, Target, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MemoryVaultPage = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data - in real app, this would come from your backend
  const memoryData = {
    personal: [
      { id: 1, category: 'Personal', icon: User, content: 'Lives in Mumbai, software engineer', date: '2024-01-15' },
      { id: 2, category: 'Personal', icon: Heart, content: 'Loves cooking, especially Italian cuisine', date: '2024-01-20' },
      { id: 3, category: 'Personal', icon: Target, content: 'Goal: Run a marathon by end of 2024', date: '2024-02-01' }
    ],
    health: [
      { id: 4, category: 'Health', icon: Brain, content: 'Struggles with work stress, prefers meditation', date: '2024-01-18' },
      { id: 5, category: 'Health', icon: Heart, content: 'Vegetarian diet, lactose intolerant', date: '2024-01-25' }
    ],
    career: [
      { id: 6, category: 'Career', icon: Lightbulb, content: 'Interested in transitioning to Product Management', date: '2024-02-05' },
      { id: 7, category: 'Career', icon: Target, content: 'Preparing for MBA applications', date: '2024-02-10' }
    ],
    conversations: [
      { id: 8, category: 'Conversations', icon: MessageCircle, content: 'Had breakthrough in therapy about family relationships', date: '2024-02-12' },
      { id: 9, category: 'Conversations', icon: MessageCircle, content: 'Discussed meal prep strategies with nutrition guru', date: '2024-02-14' }
    ]
  };

  const allMemories = [
    ...memoryData.personal,
    ...memoryData.health,
    ...memoryData.career,
    ...memoryData.conversations
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const categories = [
    { id: 'all', name: 'All Memories', count: allMemories.length },
    { id: 'personal', name: 'Personal', count: memoryData.personal.length },
    { id: 'health', name: 'Health', count: memoryData.health.length },
    { id: 'career', name: 'Career', count: memoryData.career.length },
    { id: 'conversations', name: 'Conversations', count: memoryData.conversations.length }
  ];

  const getFilteredMemories = () => {
    if (selectedCategory === 'all') return allMemories;
    return memoryData[selectedCategory as keyof typeof memoryData] || [];
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Personal': return 'bg-blue-50 text-blue-700';
      case 'Health': return 'bg-green-50 text-green-700';
      case 'Career': return 'bg-orange-50 text-orange-700';
      case 'Conversations': return 'bg-purple-50 text-purple-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <Card className="p-8 text-center">
          <Brain className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="text-gray-600">You need to be signed in to access your Memory Vault.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Memory Vault
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4">
              Your personal "Yaaddasht Ka Khazana" 🧠✨
            </p>
            <p className="text-lg text-gray-500 italic">
              Everything your AI gurujis remember about you, all in one place
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-2"
              >
                <span>{category.name}</span>
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Memory Cards */}
          <div className="max-w-4xl mx-auto">
            {getFilteredMemories().length === 0 ? (
              <Card className="p-12 text-center">
                <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-600">
                  No memories yet in this category
                </h3>
                <p className="text-gray-500">
                  Start chatting with your AI gurujis to build your memory vault!
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {getFilteredMemories().map((memory) => (
                  <Card key={memory.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <memory.icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={getCategoryColor(memory.category)}>
                                {memory.category}
                              </Badge>
                              <div className="flex items-center text-gray-500 text-sm">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(memory.date).toLocaleDateString('en-IN')}
                              </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                              {memory.content}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-16 max-w-3xl mx-auto">
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="text-center">How does Memory Vault work?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <Brain className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                    <h4 className="font-semibold mb-2">Smart Learning</h4>
                    <p className="text-sm text-gray-600">
                      Your AI gurujis remember important details from your conversations
                    </p>
                  </div>
                  <div className="text-center">
                    <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                    <h4 className="font-semibold mb-2">Personal Touch</h4>
                    <p className="text-sm text-gray-600">
                      Get more personalized advice based on your history
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MemoryVaultPage;
