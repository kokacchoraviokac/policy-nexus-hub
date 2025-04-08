
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/shadcn';

export interface LoaderButtonProps extends ButtonProps {
  loading?: boolean;
}

export const LoaderButton = React.forwardRef<HTMLButtonElement, LoaderButtonProps>(
  ({ children, loading = false, disabled, className, ...props }, ref) => {
    return (
      <Button
        className={cn(className)}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Button>
    );
  }
);

LoaderButton.displayName = 'LoaderButton';
