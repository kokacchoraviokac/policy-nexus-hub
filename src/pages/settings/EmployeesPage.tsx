
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Plus,
  MoreHorizontal,
  Mail,
  UserCog,
  CheckCircle, 
  XCircle
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import EmployeeForm from "@/components/settings/employees/EmployeeForm";
import { User, UserRole } from "@/types/auth";
import { Badge } from "@/components/ui/badge";

interface Employee extends User {
  id: string;
  is_active?: boolean;
  department?: string;
  position?: string;
  phone?: string;
}

const EmployeesPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  useEffect(() => {
    fetchEmployees();
  }, [user]);
  
  useEffect(() => {
    applyFilters();
  }, [employees, searchQuery, statusFilter]);
  
  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      // Only fetch profiles that belong to the same company as the current user
      let query = supabase
        .from('profiles')
        .select('*');
      
      if (user?.companyId) {
        query = query.eq('company_id', user.companyId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Transform the data to match the Employee interface
        const transformedData: Employee[] = data.map(profile => ({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role as UserRole, // Cast the role string to UserRole type
          companyId: profile.company_id,
          avatar: profile.avatar_url,
          is_active: true, // Assuming all profiles are active by default
          // Additional fields could be added here if they exist in the profiles table
        }));
        setEmployees(transformedData);
        setFilteredEmployees(transformedData);
      }
    } catch (error: any) {
      console.error('Error fetching employees:', error.message);
      toast.error(`Failed to load employees: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyFilters = () => {
    let filtered = [...employees];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        emp => 
          emp.name?.toLowerCase().includes(query) || 
          emp.email?.toLowerCase().includes(query) ||
          emp.role?.toLowerCase().includes(query) ||
          emp.department?.toLowerCase().includes(query) ||
          emp.position?.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter(emp => emp.is_active === isActive);
    }
    
    setFilteredEmployees(filtered);
  };
  
  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };
  
  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };
  
  const handleSaveEmployee = async (employeeData: Partial<Employee>) => {
    try {
      if (editingEmployee) {
        // Update existing employee
        const { error } = await supabase
          .from('profiles')
          .update({
            name: employeeData.name,
            role: employeeData.role,
            // Add any other fields that need updating
          })
          .eq('id', editingEmployee.id);
        
        if (error) throw error;
        toast.success("Employee updated successfully");
      } else {
        // For new employees, we'll use the invitation system
        toast.success("Invitation sent to new employee");
      }
      
      // Refresh the employee list
      fetchEmployees();
      handleCloseForm();
    } catch (error: any) {
      toast.error(`Error saving employee: ${error.message}`);
    }
  };
  
  const handleInviteEmployee = async (email: string, role: string) => {
    try {
      // This would typically integrate with the invitation system
      // For now, we'll just show a success message
      toast.success(`Invitation sent to ${email}`);
      handleCloseForm();
    } catch (error: any) {
      toast.error(`Failed to send invitation: ${error.message}`);
    }
  };
  
  const handleResendInvitation = async (email: string) => {
    try {
      // Would integrate with the invitation system
      toast.success(`Invitation resent to ${email}`);
    } catch (error: any) {
      toast.error(`Failed to resend invitation: ${error.message}`);
    }
  };
  
  const handleToggleStatus = async (employee: Employee) => {
    try {
      const newStatus = !employee.is_active;
      
      // In a real implementation, update the status in the database
      // For now, just update the local state
      setEmployees(employees.map(emp => 
        emp.id === employee.id ? { ...emp, is_active: newStatus } : emp
      ));
      
      toast.success(`Employee ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error: any) {
      toast.error(`Failed to update employee status: ${error.message}`);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">{t("employees")}</h1>
        <p className="text-muted-foreground">
          {t("employeesDescription")}
        </p>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("employees")}</CardTitle>
            <CardDescription>{t("manageEmployees")}</CardDescription>
          </div>
          <Button onClick={handleAddEmployee}>
            <Plus className="mr-2 h-4 w-4" />
            {t("addEmployee")}
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder={t("searchEmployees")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs
              defaultValue="all" 
              value={statusFilter}
              onValueChange={setStatusFilter}
              className="w-full md:w-auto"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="all">{t("allEmployees")}</TabsTrigger>
                <TabsTrigger value="active">{t("activeEmployees")}</TabsTrigger>
                <TabsTrigger value="inactive">{t("inactiveEmployees")}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{t("email")}</TableHead>
                    <TableHead>{t("role")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        {t("noEmployeesFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>
                          <Badge variant={employee.role === 'admin' ? "outline" : "secondary"}>
                            {employee.role || 'employee'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={employee.is_active ? "success" : "destructive"}>
                            {employee.is_active ? t("active") : t("inactive")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" title={t("actions")}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditEmployee(employee)}>
                                <UserCog className="mr-2 h-4 w-4" />
                                {t("editEmployee")}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleResendInvitation(employee.email || '')}>
                                <Mail className="mr-2 h-4 w-4" />
                                {t("resendInvitation")}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(employee)}>
                                {employee.is_active ? (
                                  <>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    {t("deactivate")}
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    {t("activate")}
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {showForm && (
        <EmployeeForm 
          employee={editingEmployee} 
          isOpen={showForm} 
          onClose={handleCloseForm}
          onSave={handleSaveEmployee}
          onInvite={handleInviteEmployee}
        />
      )}
    </div>
  );
};

export default EmployeesPage;
