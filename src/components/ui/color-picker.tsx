
import React from 'react';
import { Input } from '@/components/ui/input';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ColorPicker = ({ value, onChange, className = '' }: ColorPickerProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div 
        className="w-8 h-8 rounded-md border" 
        style={{ backgroundColor: value }} 
      />
      <Input 
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-16 h-8 p-0 ${className}`}
      />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-24 h-8"
        maxLength={7}
        placeholder="#RRGGBB"
      />
    </div>
  );
};
