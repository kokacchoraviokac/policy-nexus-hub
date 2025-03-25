
import React from "react";

const DemoAccounts: React.FC = () => {
  return (
    <div className="text-center text-sm text-muted-foreground mt-4">
      <div className="mb-2">
        Demo Accounts:
      </div>
      <div className="grid grid-cols-1 gap-1">
        <code className="relative rounded bg-muted px-[0.5rem] py-[0.2rem] font-mono text-xs">
          superadmin@policyhub.com (Super Admin)
        </code>
        <code className="relative rounded bg-muted px-[0.5rem] py-[0.2rem] font-mono text-xs">
          admin@example.com (Broker Admin)
        </code>
        <code className="relative rounded bg-muted px-[0.5rem] py-[0.2rem] font-mono text-xs">
          employee@example.com (Employee)
        </code>
      </div>
      <div className="mt-2 text-xs">
        Password: any (when using mock authentication)
      </div>
    </div>
  );
};

export default DemoAccounts;
