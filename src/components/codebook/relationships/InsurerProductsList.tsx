
import React from "react";
import { useNavigate } from "react-router-dom";
import { useInsuranceProducts } from "@/hooks/useInsuranceProducts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Plus, BarChart2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface InsurerProductsListProps {
  insurerId: string;
  onAddProduct?: () => void;
}

export const InsurerProductsList: React.FC<InsurerProductsListProps> = ({ 
  insurerId,
  onAddProduct
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { products, isLoading, isError } = useInsuranceProducts(insurerId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-md">
        {t('failedToLoadProducts')}
      </div>
    );
  }

  // Calculate counts for statistics
  const activeProducts = products?.filter(product => product.is_active).length || 0;
  const inactiveProducts = (products?.length || 0) - activeProducts;

  return (
    <div className="space-y-4">
      {/* Products Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('totalProducts')}
                </p>
                <h3 className="text-2xl font-bold">{products?.length || 0}</h3>
              </div>
              <BarChart2 className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('activeProducts')}
                </p>
                <h3 className="text-2xl font-bold">{activeProducts}</h3>
              </div>
              <Badge className="bg-green-500">{activeProducts > 0 ? `${Math.round((activeProducts / (products?.length || 1)) * 100)}%` : '0%'}</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('inactiveProducts')}
                </p>
                <h3 className="text-2xl font-bold">{inactiveProducts}</h3>
              </div>
              <Badge variant="outline">{inactiveProducts > 0 ? `${Math.round((inactiveProducts / (products?.length || 1)) * 100)}%` : '0%'}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products List Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{t('insuranceProducts')}</h3>
        {onAddProduct && (
          <Button size="sm" onClick={onAddProduct}>
            <Plus className="h-4 w-4 mr-1" />
            {t('addProduct')}
          </Button>
        )}
      </div>
      
      {/* Products Table */}
      {products && products.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('code')}</TableHead>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('category')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(product => (
              <TableRow key={product.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/codebook/products/${product.id}`)}>
                <TableCell className="font-medium">{product.code}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category || "-"}</TableCell>
                <TableCell>
                  <Badge variant={product.is_active ? "default" : "outline"}>
                    {product.is_active ? t('active') : t('inactive')}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/codebook/products/${product.id}`);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="p-8 text-center border rounded-md bg-muted/50">
          <p className="text-muted-foreground">{t('noProductsAssociatedWithInsurer')}</p>
          {onAddProduct && (
            <Button variant="outline" className="mt-4" onClick={onAddProduct}>
              <Plus className="h-4 w-4 mr-1" />
              {t('addYourFirstProduct')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
