import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthContextType, User } from '../data/types';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
        return;
      }
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    }).catch((error) => {
      console.error('Error in getSession:', error);
      setUser(null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        // If it's a row-level security error, the user might not have a profile yet
        if (error.code === 'PGRST116' || error.message.includes('row-level security')) {
          // Try to create a profile for this user
          const { data: authUser } = await supabase.auth.getUser();
          if (authUser.user) {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: authUser.user.id,
                email: authUser.user.email || '',
                role: 'user'
              })
              .select()
              .single();
            
            if (createError) {
              console.error('Error creating profile:', createError);
              toast.error('Failed to create user profile');
              setUser(null);
            } else {
              setUser(newProfile);
            }
          }
        } else {
          toast.error('Failed to load user profile');
          setUser(null);
        }
      } else {
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      toast.success('Signed in successfully!');
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, role: 'user' | 'admin' = 'user') => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      if (error) throw error;

      if (data.user) {
        // Create profile immediately
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email || email,
            role
          })
          .select()
          .single();

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw profileError;
        }
        
        // Set the user immediately if we're creating an admin user
        if (role === 'admin') {
          setUser(profile);
        }
        
        toast.success('Account created successfully!');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message);
      setLoading(false);
      throw error;
    } finally {
      // Only set loading to false if we're not setting a user (admin case)
      if (role !== 'admin') {
        setLoading(false);
      }
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast.success('Signed out successfully!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};