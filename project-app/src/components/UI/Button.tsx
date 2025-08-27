import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: typeof LucideIcon;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  disabled = false,
  type = 'button',
  className = ''
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-xl 
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    backdrop-blur-md border disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantClasses = {
    primary: 'bg-blue-500/80 hover:bg-blue-600/80 text-white border-blue-500/50 focus:ring-blue-500',
    secondary: 'bg-white/20 hover:bg-white/30 text-gray-700 border-white/30 focus:ring-gray-500',
    danger: 'bg-red-500/80 hover:bg-red-600/80 text-white border-red-500/50 focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-white/10 text-gray-700 border-transparent focus:ring-gray-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};