
import React from "react";
import PrivilegeTest from "@/components/auth/PrivilegeTest";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PrivilegeTestPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Privilege Testing</h1>
        <p className="text-muted-foreground">
          Test the role-based access control system to verify permissions are working correctly.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <PrivilegeTest />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>How to Use This Tool</CardTitle>
            <CardDescription>
              Verify that your permission system is working as expected
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Simple Permission Check</h3>
              <p className="text-sm text-muted-foreground">
                Enter a privilege like "policies:view" to check if the current user has that permission.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">Context-Based Permission Check</h3>
              <p className="text-sm text-muted-foreground">
                Enable "Use context data" to test permissions that depend on resource ownership or other attributes.
              </p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 mt-2">
                <li>For "own resource" checks, set Owner ID to the current user's ID</li>
                <li>For company-specific checks, set Company ID to the current user's company</li>
                <li>For value-based checks (like high-value claims), use Resource Type "amount"</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium">Example Permissions to Test</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5">
                <li>policies:view - Can view policies module</li>
                <li>policies.own:edit - Can edit own policies</li>
                <li>claims.highValue:edit - Can edit high-value claims</li>
                <li>finances.commissions.company:view - Can view commissions for their company</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivilegeTestPage;
