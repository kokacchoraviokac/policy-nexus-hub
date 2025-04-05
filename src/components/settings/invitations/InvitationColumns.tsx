
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Mail, Copy, Trash2 } from "lucide-react";
import { formatDateToLocal } from "@/utils/dateUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Invitation = {
  id: string;
  email: string;
  status: "pending" | "accepted" | "expired";
  role: string;
  company_id: string;
  company_name?: string;
  created_at: string;
  expires_at: string;
};

export const columns: ColumnDef<Invitation>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <div className="text-left">Email</div>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <div className="text-left">Role</div>
      );
    },
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      
      return (
        <div className="capitalize">{role}</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div className="text-left">Status</div>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as "pending" | "accepted" | "expired";
      
      return (
        <StatusBadge status={status} />
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <div className="text-left">Created</div>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as string;
      
      return (
        <div>{formatDateToLocal(createdAt)}</div>
      );
    },
  },
  {
    accessorKey: "expires_at",
    header: ({ column }) => {
      return (
        <div className="text-left">Expires</div>
      );
    },
    cell: ({ row }) => {
      const expiresAt = row.getValue("expires_at") as string;
      
      return (
        <div>{formatDateToLocal(expiresAt)}</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invitation = row.original;
      const { t } = useLanguage();

      const copyToClipboard = () => {
        const inviteUrl = `${window.location.origin}/invite/${invitation.id}`;
        navigator.clipboard.writeText(inviteUrl);
      };
      
      const resendInvitation = () => {
        // Logic to resend invitation email
        console.log("Resend invitation", invitation.id);
      };
      
      const deleteInvitation = () => {
        // Logic to delete invitation
        console.log("Delete invitation", invitation.id);
      };
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
            <DropdownMenuItem onClick={copyToClipboard}>
              <Copy className="mr-2 h-4 w-4" />
              <span>{t("copyInviteLink")}</span>
            </DropdownMenuItem>
            {invitation.status === "pending" && (
              <DropdownMenuItem onClick={resendInvitation}>
                <Mail className="mr-2 h-4 w-4" />
                <span>{t("resendEmail")}</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={deleteInvitation}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>{t("delete")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const StatusBadge: React.FC<{ status: "pending" | "accepted" | "expired" }> = ({ status }) => {
  const { t } = useLanguage();
  
  const variants = {
    pending: "bg-blue-100 text-blue-800 border-blue-200",
    accepted: "bg-green-100 text-green-800 border-green-200",
    expired: "bg-gray-100 text-gray-800 border-gray-200"
  };
  
  return (
    <Badge variant="outline" className={`${variants[status]}`}>
      {t(status)}
    </Badge>
  );
};
