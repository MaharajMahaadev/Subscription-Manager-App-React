import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  error?: string;
  icon?: typeof LucideIcon;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  placeholder,
  type = 'text',
  error,
  icon: Icon,
  disabled = false,
  required = false,
  className = '',
  ...rest
}, ref) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          {...rest}
          className={`
            w-full px-4 py-2 ${Icon ? 'pl-10' : ''} rounded-xl border border-white/30
            backdrop-blur-md bg-white/20 placeholder-gray-500 text-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
          `}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';