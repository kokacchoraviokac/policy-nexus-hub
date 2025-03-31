
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { InsuranceProduct } from "@/types/codebook";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductsTableProps {
  products: InsuranceProduct[];
  isLoading: boolean;
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
  setProductToDelete: (productId: string | null) => void;
  productToDelete: string | null;
  handleDelete: () => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  isLoading,
  onEdit,
  onDelete,
  setProductToDelete,
  productToDelete,
  handleDelete
}) => {
  const { t } = useLanguage();
  
  const columns = [
    {
      header: t("code"),
      accessorKey: "code" as keyof InsuranceProduct,
      sortable: true
    },
    {
      header: t("name"),
      accessorKey: "name" as keyof InsuranceProduct,
      sortable: true
    },
    {
      header: t("category"),
      accessorKey: "category" as keyof InsuranceProduct,
      cell: (row: InsuranceProduct) => row.category || "-",
      sortable: true
    },
    {
      header: t("insurer"),
      accessorKey: "insurer_name" as keyof InsuranceProduct,
      sortable: true
    },
    {
      header: t("status"),
      accessorKey: "is_active" as keyof InsuranceProduct,
      cell: (row: InsuranceProduct) => (
        <Badge variant={row.is_active ? "default" : "secondary"}>
          {row.is_active ? t("active") : t("inactive")}
        </Badge>
      ),
      sortable: true
    },
    {
      header: t("actions"),
      accessorKey: (row: InsuranceProduct) => (
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
                onClick={() => setProductToDelete(row.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("deleteProductConfirmation").replace("{0}", row.name)}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setProductToDelete(null)}>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
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
      data={products || []}
      columns={columns}
      isLoading={isLoading}
      emptyState={{
        title: t("noProductsFound"),
        description: t("noProductsFound"),
        action: null
      }}
    />
  );
};

export default ProductsTable;
