
import React from "react";

const BankStatementLoadingState: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-10 w-40 bg-muted rounded animate-pulse" />
        <div className="h-10 w-32 bg-muted rounded animate-pulse" />
      </div>
      <div className="h-40 bg-muted rounded animate-pulse" />
      <div className="h-60 bg-muted rounded animate-pulse" />
    </div>
  );
};

export default BankStatementLoadingState;
