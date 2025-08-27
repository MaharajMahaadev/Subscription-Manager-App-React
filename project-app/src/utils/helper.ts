import type { Subscription } from '../data/types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getDaysUntilRenewal = (renewalDate: string): number => {
  const today = new Date();
  const renewal = new Date(renewalDate);
  const diffTime = renewal.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getUpcomingRenewals = (subscriptions: Subscription[]): Subscription[] => {
  return subscriptions
    .filter(sub => getDaysUntilRenewal(sub.renewal_date) <= 7)
    .sort((a, b) => new Date(a.renewal_date).getTime() - new Date(b.renewal_date).getTime());
};

export const calculateMonthlyCost = (cost: number, cycle: string): number => {
  switch (cycle) {
    case 'monthly':
      return cost;
    case 'quarterly':
      return cost / 3;
    case 'yearly':
      return cost / 12;
    default:
      return cost;
  }
};

export const categorizeSubscription = (serviceName: string): 'necessary' | 'optional' => {
  const necessaryServices = [
    'netflix', 'spotify', 'internet', 'phone', 'electricity', 'water',
    'insurance', 'bank', 'credit card', 'mortgage', 'rent'
  ];
  
  const serviceLower = serviceName.toLowerCase();
  return necessaryServices.some(service => serviceLower.includes(service)) 
    ? 'necessary' 
    : 'optional';
};