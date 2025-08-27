import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hover = false 
}) => {
  const hoverClasses = hover 
    ? 'hover:bg-white/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300' 
    : '';

  return (
    <div className={`
      backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl 
      shadow-lg p-6 ${hoverClasses} ${className}
    `}>
      {children}
    </div>
  );
};