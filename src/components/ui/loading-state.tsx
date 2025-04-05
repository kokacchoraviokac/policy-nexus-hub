
import React, { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  children?: ReactNode;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ children, className }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 space-y-4 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {children && <p className="text-muted-foreground text-center">{children}</p>}
    </div>
  );
};

export default LoadingState;
