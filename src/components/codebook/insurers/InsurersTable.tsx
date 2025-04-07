
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { Insurer } from "@/types/codebook";
import { useLanguage } from "@/contexts/LanguageContext";
import { ColumnDef } from "@tanstack/react-table";

// Export the table columns function for reuse across the app
export const getInsurerColumns = (onEdit?: (id: string) => void, onDelete?: (id: string) => void): ColumnDef<Insurer, unknown>[] => {
  const { t } = useLanguage();
  
  return [
    {
      accessorKey: "name",
      header: t("name"),
    },
    {
      accessorKey: "contact_person",
      header: t("contactPerson"),
      cell: ({ row }) => row.original.contact_person || "-",
    },
    {
      accessorKey: "email",
      header: t("email"),
      cell: ({ row }) => row.original.email || "-",
    },
    {
      accessorKey: "phone", 
      header: t("phone"),
      cell: ({ row }) => row.original.phone || "-",
    },
    {
      accessorKey: "country",
      header: t("country"),
      cell: ({ row }) => row.original.country || "-",
    },
    {
      accessorKey: "is_active",
      header: t("status"),
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? "default" : "secondary"}>
          {row.original.is_active ? t("active") : t("inactive")}
        </Badge>
      ),
    },
    ...(onEdit || onDelete ? [
      {
        id: "actions",
        header: t("actions"),
        cell: ({ row }) => (
          <div className="flex gap-2 justify-end">
            {onEdit && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => onEdit(row.original.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-destructive"
                onClick={() => onDelete(row.original.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        ),
      }
    ] as ColumnDef<Insurer, unknown>[] : []),
  ];
};

// This is the actual component that renders the insurers table
const InsurersTable: React.FC = () => {
  return null; // This component doesn't render anything itself, just exports the columns function
};

export default InsurersTable;
