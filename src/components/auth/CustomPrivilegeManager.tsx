
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { fetchUserCustomPrivileges, grantCustomPrivilege, revokeCustomPrivilege } from "@/utils/authUtils";
import { CustomPrivilege } from "@/types/auth/index";

const privilegeFormSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  privilege: z.string().min(1, "Privilege is required"),
  expiresAt: z.date().optional(),
});

type PrivilegeFormValues = z.infer<typeof privilegeFormSchema>;

interface CustomPrivilegeManagerProps {
  userId?: string; // Optional - if not provided, uses current user
  isAdmin?: boolean; // If true, allows managing custom privileges
}

const CustomPrivilegeManager: React.FC<CustomPrivilegeManagerProps> = ({
  userId,
  isAdmin = false,
}) => {
  const { user, customPrivileges } = useAuth();
  const [privileges, setPrivileges] = useState<CustomPrivilege[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const targetUserId = userId || user?.id;
  
  const form = useForm<PrivilegeFormValues>({
    resolver: zodResolver(privilegeFormSchema),
    defaultValues: {
      userId: targetUserId,
      privilege: "",
    },
  });
  
  // Use provided custom privileges or fetch them
  useEffect(() => {
    if (!targetUserId) return;
    
    // If we're looking at the current user, use the context value
    if (targetUserId === user?.id) {
      // Cast to convert context to ensure type compatibility
      const convertedPrivileges = [...customPrivileges].map(priv => ({
        ...priv,
        // Ensure context is always a string
        context: typeof priv.context === 'object' ? JSON.stringify(priv.context) : priv.context
      }));
      setPrivileges(convertedPrivileges);
      return;
    }
    
    // Otherwise fetch custom privileges for the specified user
    const loadPrivileges = async () => {
      setIsLoading(true);
      try {
        const userPrivileges = await fetchUserCustomPrivileges(targetUserId);
        // Convert any object contexts to strings to ensure type compatibility
        const convertedPrivileges = userPrivileges.map(priv => ({
          ...priv,
          // Ensure context is always a string
          context: typeof priv.context === 'object' ? JSON.stringify(priv.context) : priv.context
        }));
        setPrivileges(convertedPrivileges);
      } catch (error) {
        console.error("Error loading privileges:", error);
        toast.error("Failed to load custom privileges");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPrivileges();
  }, [targetUserId, user?.id, customPrivileges]);
  
  const handleGrantPrivilege = async (values: PrivilegeFormValues) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      // Convert the Date to ISO string if present
      const expiresAtString = values.expiresAt ? values.expiresAt.toISOString() : undefined;
      
      await grantCustomPrivilege(
        values.userId,
        values.privilege,
        user.id,
        expiresAtString
      );
      
      // Refresh privileges
      const updatedPrivileges = await fetchUserCustomPrivileges(values.userId);
      // Convert any object contexts to strings
      const convertedPrivileges = updatedPrivileges.map(priv => ({
        ...priv,
        context: typeof priv.context === 'object' ? JSON.stringify(priv.context) : priv.context
      }));
      setPrivileges(convertedPrivileges);
      setIsDialogOpen(false);
      form.reset();
      toast.success("Privilege granted successfully");
    } catch (error) {
      console.error("Error granting privilege:", error);
      toast.error("Failed to grant privilege");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRevokePrivilege = async (privilegeId: string) => {
    setIsLoading(true);
    try {
      await revokeCustomPrivilege(privilegeId);
      
      // Update local state
      setPrivileges(prev => prev.filter(p => p.id !== privilegeId));
      toast.success("Privilege revoked successfully");
    } catch (error) {
      console.error("Error revoking privilege:", error);
      toast.error("Failed to revoke privilege");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!targetUserId) {
    return <div>User ID is required</div>;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Custom Privileges</CardTitle>
            </div>
            
            {isAdmin && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Privilege
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Grant Custom Privilege</DialogTitle>
                    <DialogDescription>
                      Grant a custom privilege to a user that extends beyond their role-based permissions.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleGrantPrivilege)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="userId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>User ID</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!!userId} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="privilege"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Privilege</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a privilege" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="policies.all:view">View all policies</SelectItem>
                                <SelectItem value="policies.all:edit">Edit all policies</SelectItem>
                                <SelectItem value="claims.all:view">View all claims</SelectItem>
                                <SelectItem value="claims.all:edit">Edit all claims</SelectItem>
                                <SelectItem value="finances.all:view">View all finances</SelectItem>
                                <SelectItem value="reports.export:all">Export all reports</SelectItem>
                                <SelectItem value="users:manage">Manage users</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="expiresAt"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Expiration Date (Optional)</FormLabel>
                            <DatePicker
                              date={field.value}
                              setDate={field.onChange}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? "Granting..." : "Grant Privilege"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <CardDescription>
            Special privileges granted to this user beyond their role-based permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="text-center py-4">Loading privileges...</div>}
          
          {!isLoading && privileges.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No custom privileges have been granted
            </div>
          )}
          
          {!isLoading && privileges.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Privilege</TableHead>
                  <TableHead>Granted By</TableHead>
                  <TableHead>Granted Date</TableHead>
                  <TableHead>Expires</TableHead>
                  {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {privileges.map((privilege) => (
                  <TableRow key={privilege.id}>
                    <TableCell>
                      <Badge variant="outline">{privilege.privilege}</Badge>
                    </TableCell>
                    <TableCell>{privilege.granted_by}</TableCell>
                    <TableCell>{new Date(privilege.granted_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {privilege.expires_at 
                        ? new Date(privilege.expires_at).toLocaleDateString()
                        : "Never"
                      }
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevokePrivilege(privilege.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomPrivilegeManager;
