
import React from "react";

const Finances = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Finances</h1>
        <p className="text-muted-foreground">
          Manage commissions, invoicing, and financial statement processing.
        </p>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg border border-border text-center">
        <p className="text-lg font-medium">Financial Operations Module</p>
        <p className="text-muted-foreground mt-2">This section will contain financial management tools.</p>
      </div>
    </div>
  );
};

export default Finances;
