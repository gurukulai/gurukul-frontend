
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';

const GuruDakshinaPage = () => {
  const plans = [
    {
      name: 'Shishya',
      hindi: 'शिष्य',
      price: '₹0',
      period: '/month',
      description: 'Perfect for getting started with your AI gurujis',
      features: [
        '50 messages per month',
        'Access to all AI gurujis',
        'Basic support',
        'Community access'
      ],
      icon: Star,
      color: 'gray',
      buttonText: 'Start Free',
      popular: false
    },
    {
      name: 'Sevak',
      hindi: 'सेवक',
      price: '₹499',
      period: '/month',
      description: 'For regular learners who want more guidance',
      features: [
        'Unlimited messages',
        'Priority responses',
        'Advanced features',
        'Email support',
        'Memory of past conversations',
        'Personalized insights'
      ],
      icon: Zap,
      color: 'blue',
      buttonText: 'Choose Sevak',
      popular: true
    },
    {
      name: 'Param Shishya',
      hindi: 'परम शिष्य',
      price: '₹999',
      period: '/month',
      description: 'For serious learners who want the full guru experience',
      features: [
        'Everything in Sevak',
        '24/7 priority support',
        'Custom AI training',
        'Advanced analytics',
        'One-on-one sessions',
        'Exclusive content',
        'Beta features access'
      ],
      icon: Crown,
      color: 'gold',
      buttonText: 'Go Premium',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Guru Dakshina
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4">
              Choose your learning journey with our AI gurujis
            </p>
            <p className="text-lg text-gray-500 italic">
              "गुरु दक्षिणा" - A humble offering for infinite wisdom
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative hover:shadow-2xl transition-all duration-300 ${
                  plan.popular ? 'ring-2 ring-primary scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    plan.color === 'gray' ? 'bg-gray-100' :
                    plan.color === 'blue' ? 'bg-primary/10' :
                    'bg-gradient-to-br from-yellow-400 to-orange-500'
                  }`}>
                    <plan.icon className={`w-8 h-8 ${
                      plan.color === 'gray' ? 'text-gray-600' :
                      plan.color === 'blue' ? 'text-primary' :
                      'text-white'
                    }`} />
                  </div>
                  
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="text-sm text-gray-500 mb-4">{plan.hindi}</div>
                  
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-500 ml-2">{plan.period}</span>
                  </div>
                  
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full py-3 text-lg ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary/90' 
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-gray-600 mb-4">
              All plans include access to our community of learners
            </p>
            <p className="text-sm text-gray-500">
              Prices in Indian Rupees. Cancel anytime. No hidden fees.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What is Guru Dakshina?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Guru Dakshina is a traditional offering to one's teacher. Our pricing reflects this 
                    philosophy - you pay for the wisdom and guidance you receive from our AI gurujis.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I switch plans anytime?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Absolutely! You can upgrade or downgrade your plan anytime. Changes take effect 
                    from your next billing cycle.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is there a free trial?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Yes! Start with our Shishya plan for free. You get 50 messages per month to 
                    experience the wisdom of our AI gurujis.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GuruDakshinaPage;
