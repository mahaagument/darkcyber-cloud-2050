
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading, 
  className, 
  ...props 
}) => {
  const variants = {
    primary: 'bg-[#00ff9d] text-black hover:bg-[#00e68e] shadow-[0_0_15px_rgba(0,255,157,0.3)]',
    secondary: 'bg-transparent border border-[#bc13fe] text-[#bc13fe] hover:bg-[#bc13fe]/10 shadow-[0_0_10px_rgba(188,19,254,0.2)]',
    danger: 'bg-red-600/20 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white',
    ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
  };

  const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button 
      className={`rounded-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
};
