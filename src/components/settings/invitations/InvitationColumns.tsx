
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail, AlertTriangle } from "lucide-react";
import { formatDateToLocal } from "@/utils/dateUtils";

export interface Invitation {
  id: string;
  email: string;
  role: string;
  status: string;
  company_id: string;
  company_name?: string;
  created_at: string;
  expires_at: string;
}

export interface Column<T> {
  id: string;
  header: string;
  cell: (row: T) => React.ReactNode;
}

export const columns: Column<Invitation>[] = [
  {
    id: "email",
    header: "Email",
    cell: (invitation) => <div>{invitation.email}</div>
  },
  {
    id: "role",
    header: "Role",
    cell: (invitation) => (
      <div className="capitalize">{invitation.role.replace("_", " ")}</div>
    )
  },
  {
    id: "company",
    header: "Company",
    cell: (invitation) => <div>{invitation.company_name || "—"}</div>
  },
  {
    id: "status",
    header: "Status",
    cell: (invitation) => {
      const statusMap: Record<string, { label: string; color: string }> = {
        pending: { label: "Pending", color: "text-yellow-500 bg-yellow-50" },
        accepted: { label: "Accepted", color: "text-green-500 bg-green-50" },
        expired: { label: "Expired", color: "text-red-500 bg-red-50" }
      };
      
      const { label, color } = statusMap[invitation.status] || { 
        label: invitation.status, 
        color: "text-gray-500 bg-gray-50" 
      };
      
      return (
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
          {label}
        </div>
      );
    }
  },
  {
    id: "created",
    header: "Sent",
    cell: (invitation) => formatDateToLocal(invitation.created_at)
  },
  {
    id: "expires",
    header: "Expires",
    cell: (invitation) => {
      const now = new Date();
      const expiryDate = new Date(invitation.expires_at);
      const isExpired = expiryDate < now;
      
      return (
        <div className="flex items-center">
          {isExpired && <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />}
          <span className={isExpired ? "text-red-500" : ""}>
            {formatDateToLocal(invitation.expires_at)}
          </span>
        </div>
      );
    }
  },
  {
    id: "actions",
    header: "",
    cell: (invitation) => {
      return (
        <div className="flex justify-end">
          {invitation.status === "pending" && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              title="Resend invitation"
            >
              <Mail className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    }
  }
];
