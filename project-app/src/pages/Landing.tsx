import React from 'react';
import { CreditCard, BarChart3, Bell, Shield, ArrowRight } from 'lucide-react';
import { GlassCard } from '../components/UI/GlassCard';
import { Button } from '../components/UI/Button';

interface LandingProps {
  onNavigateToLogin: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onNavigateToLogin }) => {
  const features = [
    {
      icon: CreditCard,
      title: 'Track Subscriptions',
      description: 'Manage all your subscriptions in one centralized dashboard'
    },
    {
      icon: BarChart3,
      title: 'Smart Insights',
      description: 'AI-powered analysis to optimize your subscription spending'
    },
    {
      icon: Bell,
      title: 'Renewal Alerts',
      description: 'Never miss a renewal date with intelligent notifications'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Take Control of Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Subscriptions
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Smart subscription management with AI insights, renewal tracking, 
              and cost optimization to save you money and time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={onNavigateToLogin} size="lg" className="text-lg px-8 py-4">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything you need to manage subscriptions
          </h2>
          <p className="text-xl text-gray-600">
            Powerful features designed to give you complete control
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <GlassCard key={index} hover className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <GlassCard className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to optimize your subscriptions?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who have saved money with smart subscription management.
          </p>
          <Button onClick={onNavigateToLogin} size="lg" className="text-lg px-8 py-4">
            Start Managing Today <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </GlassCard>
      </div>
    </div>
  );
};