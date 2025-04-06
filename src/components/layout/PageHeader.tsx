
import React from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: React.ReactNode;
  action?: React.ReactNode; // Alternative prop name
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, description, actions, action }) => {
  const actionContent = actions || action;
  const subtitleContent = subtitle || description;
  
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitleContent && <p className="text-muted-foreground mt-1">{subtitleContent}</p>}
      </div>
      {actionContent && <div className="flex items-center gap-2">{actionContent}</div>}
    </div>
  );
};

export default PageHeader;
