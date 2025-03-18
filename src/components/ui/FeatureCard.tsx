
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
}

const FeatureCard = ({ title, description, icon, className }: FeatureCardProps) => {
  return (
    <Card 
      className={cn('h-full transition-all duration-300 hover:shadow-xl', className)}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="mb-4 p-3 rounded-full bg-primary/10 w-fit">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground flex-grow">{description}</p>
      </div>
    </Card>
  );
};

export default FeatureCard;
