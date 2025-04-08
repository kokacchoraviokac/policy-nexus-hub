
import React from "react";
import DataTable from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/utils/format";
import { MoreHorizontal, Eye, Edit, Trash2, UserRound, Building } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Lead, LeadStatus } from "@/types/sales";

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onConvert: (lead: Lead) => void;
}

const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onConvert,
}) => {
  const { t } = useLanguage();

  const getStatusBadge = (status: string) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    
    switch (status) {
      case LeadStatus.NEW:
        variant = "secondary";
        break;
      case LeadStatus.QUALIFIED:
        variant = "default";
        break;
      case LeadStatus.CONVERTED:
        variant = "outline";
        break;
      case LeadStatus.LOST:
        variant = "destructive";
        break;
      default:
        variant = "secondary";
    }
    
    return (
      <Badge variant={variant}>
        {t(status.toLowerCase())}
      </Badge>
    );
  };

  const columns = [
    {
      accessorKey: "name",
      header: t("name"),
      cell: (props: { row: { original: Lead } }) => (
        <div>
          <span className="font-medium">{props.row.original.name}</span>
          {props.row.original.company && (
            <div className="text-sm text-muted-foreground flex items-center mt-1">
              <Building className="h-3 w-3 mr-1" />
              {props.row.original.company}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "contact",
      header: t("contact"),
      cell: (props: { row: { original: Lead } }) => (
        <div>
          {props.row.original.email && (
            <div className="text-sm">{props.row.original.email}</div>
          )}
          {props.row.original.phone && (
            <div className="text-sm text-muted-foreground">{props.row.original.phone}</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: (props: { row: { original: Lead } }) => getStatusBadge(props.row.original.status),
    },
    {
      accessorKey: "created_at",
      header: t("createdAt"),
      cell: (props: { row: { original: Lead } }) => formatDate(new Date(props.row.original.created_at)),
    },
    {
      id: "actions",
      header: t("actions"),
      cell: (props: { row: { original: Lead } }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{t("openMenu")}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(props.row.original)}>
              <Eye className="mr-2 h-4 w-4" />
              {t("view")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(props.row.original)}>
              <Edit className="mr-2 h-4 w-4" />
              {t("edit")}
            </DropdownMenuItem>
            {props.row.original.status !== LeadStatus.CONVERTED && (
              <DropdownMenuItem onClick={() => onConvert(props.row.original)}>
                <UserRound className="mr-2 h-4 w-4" />
                {t("convert")}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(props.row.original)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTable
      data={leads}
      columns={columns}
      keyField="id"
      isLoading={isLoading}
      emptyState={{
        title: t("noLeadsFound"),
        description: t("noLeadsFoundDescription"),
      }}
    />
  );
};

export default LeadsTable;
