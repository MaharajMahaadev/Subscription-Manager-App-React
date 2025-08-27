export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Subscription {
  id: string;
  service_name: string;
  cost: number;
  billing_cycle: 'monthly' | 'quarterly' | 'yearly';
  renewal_date: string;
  notes?: string;
  user_id: string;
  visibility: 'private' | 'shared';
  created_at: string;
  user?: User;
}

export interface SubscriptionInsight {
  id: string;
  category: 'necessary' | 'optional';
  reasoning: string;
  potential_savings?: number;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role?: 'user' | 'admin') => Promise<void>;
  signOut: () => Promise<void>;
}

export interface DashboardTab {
  id: string;
  label: string;
  component: React.ComponentType;
}