
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const InsurersDirectory = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Insurance Companies</CardTitle>
          <CardDescription>
            Manage insurance company records including branch and parent company details
          </CardDescription>
        </div>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Insurer
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border p-4">
          <p className="text-sm text-muted-foreground text-center py-6">
            Insurance company data will be displayed here. You'll be able to add, edit, and manage insurer records.
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Each insurer record includes name, registration details, address, contact information, and active status.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsurersDirectory;
