import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Building, FileText, Mail, Shield } from "lucide-react";
import CompanyManagement from "@/components/settings/CompanyManagement";
import InvitationManagement from "@/components/settings/InvitationManagement";

const Settings = () => {
  const { hasPrivilege } = useAuth();
  
  const canManageUsers = hasPrivilege("users:manage");
  const isSuperAdmin = hasPrivilege("company:manage");
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure system settings, manage user accounts, and set privileges.
        </p>
      </div>
      
      {isSuperAdmin && (
        <div className="mt-8">
          <CompanyManagement />
        </div>
      )}
      
      {/* Invitation Management */}
      <div className="mt-8">
        <InvitationManagement />
      </div>
      
      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
        {canManageUsers && (
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>User Management</CardTitle>
              </div>
              <CardDescription>
                Manage users and their roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Add, edit, or remove users and assign appropriate roles based on their responsibilities.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/settings/users">Manage Users</Link>
              </Button>
            </CardContent>
          </Card>
        )}
        
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-primary" />
              <CardTitle>Company Data</CardTitle>
            </div>
            <CardDescription>
              Manage company information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Update your company details, address, contact information, and registration numbers.
            </p>
            <Button variant="outline" className="w-full" disabled>
              Edit Company Data
            </Button>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Instructions</CardTitle>
            </div>
            <CardDescription>
              Manage internal guidelines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create and edit instruction documents to help users understand system functionality.
            </p>
            <Button variant="outline" className="w-full" disabled>
              Manage Instructions
            </Button>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle>Email Settings</CardTitle>
            </div>
            <CardDescription>
              Configure email notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Set up email templates, signature, and notification preferences.
            </p>
            <Button variant="outline" className="w-full" disabled>
              Configure Email
            </Button>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Privilege Testing</CardTitle>
            </div>
            <CardDescription>
              Test and verify permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Validate that role-based permissions are working as expected for different user roles.
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/settings/privileges/test">Test Privileges</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
