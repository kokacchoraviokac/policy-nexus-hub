
import React, { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface PolicyQuickInfoProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  subvalue?: ReactNode;
  sublabel?: string;
  isTag?: boolean;
}

const PolicyQuickInfo: React.FC<PolicyQuickInfoProps> = ({
  icon,
  label,
  value,
  subvalue,
  sublabel,
  isTag = false,
}) => {
  return (
    <div className="flex">
      <div className="mr-3 mt-0.5">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <div className="font-medium">
          {value}
        </div>
        {subvalue && (
          <div className="flex items-center mt-1 gap-1">
            {sublabel && <span className="text-xs text-muted-foreground">{sublabel}:</span>}
            {isTag ? (
              <Badge variant="outline" className="font-normal text-xs">
                {subvalue}
              </Badge>
            ) : (
              <span className="text-sm">{subvalue}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyQuickInfo;
