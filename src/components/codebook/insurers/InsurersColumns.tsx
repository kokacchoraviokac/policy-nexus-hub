
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { Insurer } from "@/types/codebook";
import { useLanguage } from "@/contexts/LanguageContext";
import { Column } from "@/components/ui/data-table";

export const getInsurerColumns = (onEdit?: (id: string) => void, onDelete?: (id: string) => void): Column<Insurer>[] => {
  const { t } = useLanguage();
  
  return [
    {
      header: t("name"),
      accessorKey: "name" as keyof Insurer,
      sortable: true
    },
    {
      header: t("contactPerson"),
      accessorKey: "contact_person" as keyof Insurer,
      cell: (row: Insurer) => row.contact_person || "-",
      sortable: true
    },
    {
      header: t("email"),
      accessorKey: "email" as keyof Insurer,
      cell: (row: Insurer) => row.email || "-",
      sortable: true
    },
    {
      header: t("phone"),
      accessorKey: "phone" as keyof Insurer,
      cell: (row: Insurer) => row.phone || "-",
    },
    {
      header: t("country"),
      accessorKey: "country" as keyof Insurer,
      cell: (row: Insurer) => row.country || "-",
      sortable: true
    },
    {
      header: t("status"),
      accessorKey: "is_active" as keyof Insurer,
      cell: (row: Insurer) => (
        <Badge variant={row.is_active ? "default" : "secondary"}>
          {row.is_active ? t("active") : t("inactive")}
        </Badge>
      ),
      sortable: true
    },
    ...(onEdit || onDelete ? [
      {
        header: t("actions"),
        accessorKey: "id" as keyof Insurer,
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

export default getInsurerColumns;
