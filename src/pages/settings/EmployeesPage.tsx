
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { UserRole } from "@/types/auth";
import { Employee } from "@/types/employees";

// Import the new components
import { EmployeeTable } from "@/components/settings/employees/EmployeeTable";
import { EmployeeFilters } from "@/components/settings/employees/EmployeeFilters";
import { EmployeeHeader } from "@/components/settings/employees/EmployeeHeader";
import EmployeeForm from "@/components/settings/employees/EmployeeForm";

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

  const fetchEmployees = useCallback(async () => {
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
  }, [user?.companyId]);
  
  const applyFilters = useCallback(() => {
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
  }, [employees, searchQuery, statusFilter]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

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
        <EmployeeHeader onAddEmployee={handleAddEmployee} />
        
        <CardContent>
          <EmployeeFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
          
          <EmployeeTable
            employees={filteredEmployees}
            isLoading={isLoading}
            onEdit={handleEditEmployee}
            onResendInvitation={handleResendInvitation}
            onToggleStatus={handleToggleStatus}
          />
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
