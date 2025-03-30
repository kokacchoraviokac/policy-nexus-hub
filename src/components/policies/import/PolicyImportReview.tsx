
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Policy } from "@/types/policies";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate } from "@/utils/format";
import { AlertTriangle, CheckCircle, MoreHorizontal, ArrowLeft } from "lucide-react";

interface PolicyImportReviewProps {
  policies: Partial<Policy>[];
  invalidPolicies: { policy: Partial<Policy>; errors: string[] }[];
  onBack?: () => void;
  onImport?: () => Promise<void>;
}

const PolicyImportReview: React.FC<PolicyImportReviewProps> = ({
  policies,
  invalidPolicies,
  onBack,
  onImport,
}) => {
  const { t } = useLanguage();
  const [page, setPage] = useState(1);
  const [reviewTab, setReviewTab] = useState<string>("valid");
  const itemsPerPage = 10;

  const displayPolicies = reviewTab === "valid" ? policies : invalidPolicies.map(item => item.policy);
  const totalPages = Math.ceil(displayPolicies.length / itemsPerPage);
  
  const paginatedPolicies = displayPolicies.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="space-y-4">
      {onBack && (
        <Button variant="outline" size="sm" onClick={onBack} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("back")}
        </Button>
      )}
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {reviewTab === "valid" 
            ? t("validPolicies", { count: policies.length }) 
            : t("invalidPolicies", { count: invalidPolicies.length })}
        </h3>
        
        <Tabs 
          value={reviewTab} 
          onValueChange={setReviewTab}
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="valid" className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
              {t("valid")} ({policies.length})
            </TabsTrigger>
            <TabsTrigger value="invalid" className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
              {t("invalid")} ({invalidPolicies.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("policyNumber")}</TableHead>
              <TableHead>{t("insurer")}</TableHead>
              <TableHead>{t("policyholder")}</TableHead>
              <TableHead>{t("startDate")}</TableHead>
              <TableHead>{t("expiryDate")}</TableHead>
              <TableHead>{t("premium")}</TableHead>
              <TableHead>{t("insuranceType")}</TableHead>
              {reviewTab === "invalid" && <TableHead>{t("errors")}</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPolicies.length > 0 ? (
              paginatedPolicies.map((policy, index) => (
                <TableRow key={index}>
                  <TableCell>{policy.policy_number}</TableCell>
                  <TableCell>{policy.insurer_name}</TableCell>
                  <TableCell>{policy.policyholder_name}</TableCell>
                  <TableCell>
                    {policy.start_date 
                      ? formatDate(new Date(policy.start_date)) 
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {policy.expiry_date 
                      ? formatDate(new Date(policy.expiry_date)) 
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {policy.premium && policy.currency 
                      ? formatCurrency(policy.premium, policy.currency) 
                      : policy.premium || "-"}
                  </TableCell>
                  <TableCell>{policy.product_name || "-"}</TableCell>
                  {reviewTab === "invalid" && (
                    <TableCell>
                      {invalidPolicies.find(
                        item => item.policy === policy
                      )?.errors.map((error, i) => (
                        <Badge key={i} variant="destructive" className="mr-1 mb-1">
                          {error}
                        </Badge>
                      ))}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={reviewTab === "invalid" ? 8 : 7} className="text-center py-4">
                  {reviewTab === "valid" 
                    ? t("noValidPolicies") 
                    : t("noInvalidPolicies")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <PaginationPrevious />
              </Button>
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <PaginationItem key={pageNum}>
                <Button
                  variant={pageNum === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePageChange(pageNum)}
                >
                  <PaginationLink>{pageNum}</PaginationLink>
                </Button>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                <PaginationNext />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {onImport && (
        <div className="flex justify-end mt-4">
          <Button onClick={onImport}>
            {t("importPolicies")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PolicyImportReview;
