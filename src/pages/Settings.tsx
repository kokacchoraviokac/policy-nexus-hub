
import React from "react";

const Settings = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <p className="text-muted-foreground">
        Configure system settings, manage user accounts, and set privileges.
      </p>
      
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg border border-border text-center">
        <p className="text-lg font-medium">Administration Module</p>
        <p className="text-muted-foreground mt-2">This section will provide system configuration tools.</p>
      </div>
    </div>
  );
};

export default Settings;
