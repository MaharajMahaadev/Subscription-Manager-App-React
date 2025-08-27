import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import type { Subscription } from '../../data/types';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabase';
import { GlassCard } from '../UI/GlassCard';
import { formatCurrency, calculateMonthlyCost, categorizeSubscription } from '../../utils/helper';
import { SUBSCRIPTION_CATEGORIES } from '../../data/constants';

interface InsightsProps {
  isGlobal?: boolean;
}

export const Insights: React.FC<InsightsProps> = ({ isGlobal = false }) => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, [user]);

  const fetchSubscriptions = async () => {
    if (!user) return;

    try {
      let query = supabase.from('subscriptions').select('*');
      
      if (!isGlobal) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeSubscriptions = () => {
    const necessary = subscriptions.filter(sub => 
      categorizeSubscription(sub.service_name) === 'necessary'
    );
    const optional = subscriptions.filter(sub => 
      categorizeSubscription(sub.service_name) === 'optional'
    );

    const totalMonthlyCost = subscriptions.reduce((total, sub) => 
      total + calculateMonthlyCost(sub.cost, sub.billing_cycle), 0
    );

    const necessaryMonthlyCost = necessary.reduce((total, sub) => 
      total + calculateMonthlyCost(sub.cost, sub.billing_cycle), 0
    );

    const optionalMonthlyCost = optional.reduce((total, sub) => 
      total + calculateMonthlyCost(sub.cost, sub.billing_cycle), 0
    );

    const potentialSavings = optionalMonthlyCost * 0.3; // 30% of optional subscriptions

    return {
      total: subscriptions.length,
      necessary: necessary.length,
      optional: optional.length,
      totalMonthlyCost,
      necessaryMonthlyCost,
      optionalMonthlyCost,
      potentialSavings
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const insights = analyzeSubscriptions();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {isGlobal ? 'Global Insights' : 'Your Subscription Insights'}
        </h2>
        <p className="text-gray-600">
          AI-powered analysis of your subscription spending
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Subscriptions</p>
              <p className="text-3xl font-bold text-gray-800">{insights.total}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Monthly Cost</p>
              <p className="text-3xl font-bold text-gray-800">
                {formatCurrency(insights.totalMonthlyCost)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Essential Services</p>
              <p className="text-3xl font-bold text-green-600">{insights.necessary}</p>
            </div>
            <Target className="w-8 h-8 text-green-500" />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Potential Savings</p>
              <p className="text-3xl font-bold text-orange-600">
                {formatCurrency(insights.potentialSavings)}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-orange-500" />
          </div>
        </GlassCard>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GlassCard>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-green-600 font-medium">Essential Services</span>
              <span className="font-semibold">{formatCurrency(insights.necessaryMonthlyCost)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-orange-600 font-medium">Optional Services</span>
              <span className="font-semibold">{formatCurrency(insights.optionalMonthlyCost)}</span>
            </div>
            <hr className="border-white/30" />
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold">Total Monthly</span>
              <span className="font-bold">{formatCurrency(insights.totalMonthlyCost)}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Optimization Suggestions</h3>
          <div className="space-y-3">
            {insights.optional > 0 && (
              <div className="bg-orange-100/50 border border-orange-300/50 rounded-lg p-4">
                <p className="text-orange-700 font-medium mb-2">Consider Reducing Optional Services</p>
                <p className="text-orange-600 text-sm">
                  You could save up to {formatCurrency(insights.potentialSavings)}/month by reviewing your optional subscriptions.
                </p>
              </div>
            )}
            {insights.totalMonthlyCost > 100 && (
              <div className="bg-blue-100/50 border border-blue-300/50 rounded-lg p-4">
                <p className="text-blue-700 font-medium mb-2">High Spending Alert</p>
                <p className="text-blue-600 text-sm">
                  Your monthly subscription cost is quite high. Consider consolidating similar services.
                </p>
              </div>
            )}
            {insights.necessary / insights.total > 0.7 && (
              <div className="bg-green-100/50 border border-green-300/50 rounded-lg p-4">
                <p className="text-green-700 font-medium mb-2">Great Balance!</p>
                <p className="text-green-600 text-sm">
                  Most of your subscriptions are essential services. Well done!
                </p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Categorized Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(['necessary', 'optional'] as const).map(category => {
          const categorySubscriptions = subscriptions.filter(sub => 
            categorizeSubscription(sub.service_name) === category
          );

          return (
            <GlassCard key={category}>
              <h3 className={`text-lg font-semibold mb-4 ${SUBSCRIPTION_CATEGORIES[category].color}`}>
                {SUBSCRIPTION_CATEGORIES[category].label} Subscriptions ({categorySubscriptions.length})
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {categorySubscriptions.map(sub => (
                  <div
                    key={sub.id}
                    className={`p-3 rounded-lg ${SUBSCRIPTION_CATEGORIES[category].bgColor}/30 border border-white/30`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{sub.service_name}</span>
                      <span className="font-semibold text-gray-700">
                        {formatCurrency(calculateMonthlyCost(sub.cost, sub.billing_cycle))}/mo
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};