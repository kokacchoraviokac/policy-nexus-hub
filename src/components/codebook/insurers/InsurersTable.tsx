
import React from "react";
import DataTable from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Insurer } from "@/types/codebook";
import { useLanguage } from "@/contexts/LanguageContext";

interface InsurersTableProps {
  insurers: Insurer[];
  isLoading: boolean;
  onEdit: (insurerId: string) => void;
  onDelete: (insurerId: string) => void;
}

const InsurersTable: React.FC<InsurersTableProps> = ({
  insurers,
  isLoading,
  onEdit,
  onDelete
}) => {
  const { t } = useLanguage();
  
  const columns = [
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
    {
      header: t("actions"),
      accessorKey: (row: Insurer) => (
        <div className="flex gap-2 justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => onEdit(row.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("deleteInsurerConfirmation").replace("{0}", row.name)}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(row.id)} className="bg-destructive text-destructive-foreground">
                  {t("delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={insurers || []}
      columns={columns}
      isLoading={isLoading}
      emptyState={{
        title: t("noInsuranceCompaniesFound"),
        description: t("noInsuranceCompaniesFound"),
        action: null
      }}
    />
  );
};

export default InsurersTable;
