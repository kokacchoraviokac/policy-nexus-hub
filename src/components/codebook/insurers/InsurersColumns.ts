
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Insurer } from "@/types/codebook";
import { Column } from "@/components/ui/data-table";
import EntityActionsCell from "@/components/codebook/EntityActionsCell";

export function getInsurerColumns(onViewDetails: (id: string) => void): Column<Insurer>[] {
  const { t } = useLanguage();

  return [
    {
      header: t("name"),
      accessorKey: "name",
      sortable: true,
    },
    {
      header: t("contactPerson"),
      accessorKey: "contact_person",
      cell: (row) => row.contact_person || "-",
      sortable: true,
    },
    {
      header: t("email"),
      accessorKey: "email",
      cell: (row) => row.email || "-",
    },
    {
      header: t("phone"),
      accessorKey: "phone",
      cell: (row) => row.phone || "-",
    },
    {
      header: t("city"),
      accessorKey: "city",
      cell: (row) => row.city || "-",
    },
    {
      header: t("status"),
      accessorKey: "is_active",
      cell: (row) => (
        <Badge variant={row.is_active ? "outline" : "secondary"}>
          {row.is_active ? t("active") : t("inactive")}
        </Badge>
      ),
      sortable: true,
    },
    {
      header: t("actions"),
      accessorKey: "id",
      cell: (row) => (
        <EntityActionsCell 
          id={row.id} 
          onView={() => onViewDetails(row.id)} 
          entityType="insurer"
          onEdit={() => {}} 
          onDelete={() => {}}
        />
      ),
    },
  ];
}

export default getInsurerColumns;
