
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { Insurer } from "@/types/codebook";
import { useLanguage } from "@/contexts/LanguageContext";
import { Column } from "@/components/ui/data-table";

// Export the table columns function for reuse across the app
export const getInsurerColumns = (onEdit?: (id: string) => void, onDelete?: (id: string) => void): Column<Insurer>[] => {
  const { t } = useLanguage();
  
  return [
    {
      accessorKey: "name",
      header: t("name"),
    },
    {
      accessorKey: "contact_person",
      header: t("contactPerson"),
      cell: (row: Insurer) => row.contact_person || "-",
    },
    {
      accessorKey: "email",
      header: t("email"),
      cell: (row: Insurer) => row.email || "-",
    },
    {
      accessorKey: "phone", 
      header: t("phone"),
      cell: (row: Insurer) => row.phone || "-",
    },
    {
      accessorKey: "country",
      header: t("country"),
      cell: (row: Insurer) => row.country || "-",
    },
    {
      accessorKey: "is_active",
      header: t("status"),
      cell: (row: Insurer) => (
        <Badge variant={row.is_active ? "default" : "secondary"}>
          {row.is_active ? t("active") : t("inactive")}
        </Badge>
      ),
    },
    ...(onEdit || onDelete ? [
      {
        accessorKey: "id",
        header: t("actions"),
        cell: (row: Insurer) => (
          <div className="flex gap-2 justify-end">
            {onEdit && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => onEdit(row.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-destructive"
                onClick={() => onDelete(row.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        ),
      }
    ] : [])
  ];
};

// This is the actual component that renders the insurers table
const InsurersTable: React.FC = () => {
  return null; // This component doesn't render anything itself, just exports the columns function
};

export default InsurersTable;
