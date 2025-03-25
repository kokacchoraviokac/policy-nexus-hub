
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ClientsDirectory = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Client Directory</CardTitle>
          <CardDescription>
            Manage client records including contact details and tax information
          </CardDescription>
        </div>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Client
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border p-4">
          <p className="text-sm text-muted-foreground text-center py-6">
            Client data will be displayed here. You'll be able to add, edit, and manage your client records.
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Each client record includes name, address, contact details, registration numbers, and more.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientsDirectory;
