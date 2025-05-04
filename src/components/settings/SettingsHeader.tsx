
import React from "react";

interface SettingsHeaderProps {
  title: string;
  description: string;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({ title, description }) => {
  return (
    <div className="text-center mb-6">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-1">
        {description}
      </p>
    </div>
  );
};
