
import React from "react";

interface InfoItemProps {
  label: string;
  value?: string | number | boolean | null;
  className?: string;
  formatter?: (value: any) => string;
}

export function InfoItem({ label, value, className, formatter }: InfoItemProps) {
  const displayValue = value === null || value === undefined 
    ? "—" 
    : typeof value === "boolean"
      ? value ? "Yes" : "No"
      : formatter 
        ? formatter(value)
        : String(value);
  
  return (
    <div className={`${className || ""}`}>
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-base">{displayValue}</dd>
    </div>
  );
}

export function InfoGrid({ children }: { children: React.ReactNode }) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
      {children}
    </dl>
  );
}
