
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: ReactNode;
}

const AnimatedButton = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  isLoading = false,
  icon,
  ...props
}: AnimatedButtonProps) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-70 disabled:cursor-not-allowed';

  const variantStyles = {
    default: 'bg-primary text-white hover:bg-primary/90',
    outline: 'bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-100',
    gradient: 'bg-gradient-to-r from-primary to-blue-400 text-white hover:from-primary/90 hover:to-blue-400/90',
  };

  const sizeStyles = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-opacity-30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      <span className={cn('flex items-center', isLoading && 'opacity-0')}>
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </span>
    </button>
  );
};

export default AnimatedButton;
