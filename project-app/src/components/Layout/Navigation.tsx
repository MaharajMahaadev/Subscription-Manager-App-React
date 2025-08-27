import React from 'react';
import { LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../UI/Button';

export const Navigation: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="backdrop-blur-md bg-white/20 border-b border-white/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <h1 className="text-xl font-bold text-gray-800">SubManager</h1>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-white/20">
                {user.role === 'admin' ? (
                  <Shield className="w-4 h-4 text-purple-600" />
                ) : (
                  <User className="w-4 h-4 text-blue-600" />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {user.email}
                </span>
                <span className={`
                  px-2 py-1 text-xs font-medium rounded-full
                  ${user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-blue-100 text-blue-700'
                  }
                `}>
                  {user.role}
                </span>
              </div>
              <Button onClick={signOut} variant="ghost" size="sm" icon={LogOut}>
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};