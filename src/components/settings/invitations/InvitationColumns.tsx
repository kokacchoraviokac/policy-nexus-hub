
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDateToLocal } from "@/utils/dateUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import { InvitationStatus } from "@/types/invitation";
import { Invitation } from "@/types/invitation";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { UserRole } from "@/types/auth";
import InvitationActions from "./InvitationActions";

export const useInvitationColumns = (): ColumnDef<Invitation>[] => {
  const { t } = useLanguage();

  return [
    {
      accessorKey: "email",
      header: t("email"),
      cell: ({ row }) => <div className="font-medium">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "role",
      header: t("role"),
      cell: ({ row }) => {
        const role = row.getValue("role") as UserRole;
        return <div className="capitalize">{t(role.toLowerCase())}</div>;
      },
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => {
        const status = row.getValue("status") as InvitationStatus;
        let badgeVariant: "default" | "success" | "destructive" | "outline" | "secondary" = "default";
        let icon = null;

        switch (status) {
          case InvitationStatus.PENDING:
            badgeVariant = "secondary";
            icon = <Clock className="h-3.5 w-3.5 mr-1" />;
            break;
          case InvitationStatus.ACCEPTED:
            badgeVariant = "success";
            icon = <CheckCircle className="h-3.5 w-3.5 mr-1" />;
            break;
          case InvitationStatus.EXPIRED:
            badgeVariant = "outline";
            icon = <XCircle className="h-3.5 w-3.5 mr-1" />;
            break;
          case InvitationStatus.CANCELLED:
            badgeVariant = "destructive";
            icon = <XCircle className="h-3.5 w-3.5 mr-1" />;
            break;
          default:
            badgeVariant = "default";
        }

        return (
          <Badge variant={badgeVariant} className="flex w-fit items-center">
            {icon}
            {t(status.toLowerCase())}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: t("sentDate"),
      cell: ({ row }) => formatDateToLocal(row.getValue("created_at")),
    },
    {
      accessorKey: "expires_at",
      header: t("expiryDate"),
      cell: ({ row }) => formatDateToLocal(row.getValue("expires_at")),
    },
    {
      id: "actions",
      cell: ({ row }) => <InvitationActions invitation={row.original} />,
    },
  ];
};
