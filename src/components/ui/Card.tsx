
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  glassmorphism?: boolean;
  hover?: boolean;
}

const Card = ({ children, className, glassmorphism = false, hover = false }: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-2xl shadow-md overflow-hidden transition-all duration-300',
        glassmorphism ? 'glass-card' : 'bg-white border border-gray-100',
        hover && 'hover:shadow-lg hover:translate-y-[-4px]',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <div className={cn('p-6 border-b border-gray-100', className)}>{children}</div>;
};

export const CardTitle = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <h3 className={cn('text-xl font-semibold', className)}>{children}</h3>;
};

export const CardDescription = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <p className={cn('text-sm text-muted-foreground mt-1', className)}>{children}</p>;
};

export const CardContent = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <div className={cn('p-6', className)}>{children}</div>;
};

export const CardFooter = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <div className={cn('p-6 pt-0', className)}>{children}</div>;
};

export default Card;
