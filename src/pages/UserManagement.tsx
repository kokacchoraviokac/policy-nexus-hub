
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/auth";
import { toast } from "sonner";
import { User } from "@/types/auth";

type ExtendedUser = User & {
  id: string;
};

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Only fetch profiles that belong to the same company as the current user
        // Super admins can see all users
        let query = supabase
          .from('profiles')
          .select('id, name, email, role, company_id');
        
        if (user?.role !== 'superAdmin' && user?.companyId) {
          query = query.eq('company_id', user.companyId);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setUsers(data as ExtendedUser[]);
        }
      } catch (error: any) {
        console.error('Error fetching users:', error.message);
        toast.error(`Failed to load users: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [user]);
  
  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) {
        throw error;
      }
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      toast.success("User role updated successfully");
    } catch (error: any) {
      console.error('Error updating user role:', error.message);
      toast.error(`Failed to update role: ${error.message}`);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
      <p className="text-muted-foreground">
        Manage user accounts and their roles.
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            View and manage users in your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value: UserRole) => updateUserRole(user.id, value)}
                          disabled={user.id === user.id} // Can't change own role
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="employee">Employee</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            {user.role === 'superAdmin' && (
                              <SelectItem value="superAdmin">Super Admin</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
