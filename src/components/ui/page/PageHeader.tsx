
import React from "react";

export interface PageHeaderProps {
  title: string;
  description?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  subtitle,
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <h2 className="text-lg text-muted-foreground">{subtitle}</h2>}
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      {actions && <div className="ml-auto">{actions}</div>}
    </div>
  );
};
