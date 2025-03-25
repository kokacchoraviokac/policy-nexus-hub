
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { User, UserRole } from "@/types/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface UserWithProfile extends User {
  companyName?: string;
}

const UserManagement = () => {
  const { user: currentUser, hasPrivilege } = useAuth();
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const canViewAllUsers = hasPrivilege("users:manage");
  
  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      let query = supabase.from("profiles").select(`
        id, 
        name, 
        email, 
        role, 
        avatar_url, 
        company_id,
        companies:company_id (name)
      `);

      // Filter by company if user is an admin
      if (currentUser?.role === "admin" && currentUser?.companyId) {
        query = query.eq("company_id", currentUser.companyId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
        return;
      }

      // Map the data to match our User type with companyName
      const formattedUsers = data.map((profile) => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role as UserRole,
        avatar: profile.avatar_url,
        companyId: profile.company_id,
        companyName: profile.companies?.name
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error in fetchUsers:", error);
      toast.error("An error occurred while loading users");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      // Check if user has permission to update roles
      if (!canViewAllUsers) {
        toast.error("You don't have permission to update roles");
        return;
      }

      // Check if trying to create a superAdmin as an admin
      if (currentUser?.role === "admin" && newRole === "superAdmin") {
        toast.error("Admin users cannot promote to Super Admin");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) {
        console.error("Error updating user role:", error);
        toast.error("Failed to update user role");
        return;
      }

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      toast.success("User role updated successfully");
    } catch (error) {
      console.error("Error in updateUserRole:", error);
      toast.error("An error occurred while updating the role");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "superAdmin":
        return "Super Admin";
      case "admin":
        return "Admin";
      case "employee":
        return "Employee";
      default:
        return "User";
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.companyName && user.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!canViewAllUsers) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold tracking-tight mb-6">User Management</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">You don't have permission to view this page.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">User Management</h1>
      
      <div className="mb-6">
        <Input
          placeholder="Search users by name, email or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">Loading users...</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">No users found</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {user.companyName && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Company: {user.companyName}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="flex-1 sm:flex-initial">
                      <Select
                        defaultValue={user.role}
                        onValueChange={(value: UserRole) => updateUserRole(user.id, value)}
                        disabled={user.id === currentUser?.id || (currentUser?.role === "admin" && user.role === "superAdmin")}
                      >
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee">Employee</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          {currentUser?.role === "superAdmin" && (
                            <SelectItem value="superAdmin">Super Admin</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {getRoleLabel(user.role)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
