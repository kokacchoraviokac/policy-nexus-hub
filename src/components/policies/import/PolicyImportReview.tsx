
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/utils/format";
import { AlertTriangle, CheckCircle, MoreHorizontal, ArrowLeft, Save, FileUp } from "lucide-react";

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
    <div className="space-y-6">
      {onBack && (
        <Button variant="outline" size="sm" onClick={onBack} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("back")}
        </Button>
      )}
      
      <div className="bg-muted/20 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md shadow-sm">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="font-medium">{t("validPolicies")}</span>
            <Badge variant="outline" className="ml-1">{policies.length}</Badge>
          </div>
          
          {invalidPolicies.length > 0 && (
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md shadow-sm">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="font-medium">{t("invalidPolicies")}</span>
              <Badge variant="outline" className="ml-1">{invalidPolicies.length}</Badge>
            </div>
          )}
        </div>
        
        <Tabs 
          value={reviewTab} 
          onValueChange={setReviewTab}
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="valid" className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
              {t("valid")}
            </TabsTrigger>
            <TabsTrigger value="invalid" className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
              {t("invalid")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {invalidPolicies.length > 0 && reviewTab === "valid" && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t("importContainsErrors")}</AlertTitle>
          <AlertDescription>
            {t("importContainsErrorsWarning", { count: invalidPolicies.length })}
          </AlertDescription>
        </Alert>
      )}
      
      {invalidPolicies.length === 0 && reviewTab === "valid" && (
        <Alert variant="success" className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription>
            {t("allPoliciesValidProceed")}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <div className="border-b">
          <div className="flex items-center justify-between px-4 py-2">
            <h3 className="font-medium">
              {reviewTab === "valid" 
                ? t("validPolicies") 
                : t("invalidPolicies")}
            </h3>
            
            <div className="text-sm text-muted-foreground">
              {t("totalPolicies")}: {displayPolicies.length}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">{t("policyNumber")}</TableHead>
                <TableHead>{t("insurer")}</TableHead>
                <TableHead>{t("policyholder")}</TableHead>
                <TableHead>{t("startDate")}</TableHead>
                <TableHead>{t("expiryDate")}</TableHead>
                <TableHead>{t("premium")}</TableHead>
                <TableHead>{t("product")}</TableHead>
                {reviewTab === "invalid" && <TableHead>{t("errors")}</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPolicies.length > 0 ? (
                paginatedPolicies.map((policy, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{policy.policy_number}</TableCell>
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
                      {policy.premium !== undefined && policy.currency 
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
                  <TableCell colSpan={reviewTab === "invalid" ? 8 : 7} className="text-center py-6 text-muted-foreground">
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
          <CardFooter className="flex justify-between items-center border-t p-2">
            <div className="text-sm text-muted-foreground">
              {t("page")} {page} {t("of")} {totalPages}
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="h-8 w-8"
                  >
                    <PaginationPrevious className="h-4 w-4" />
                  </Button>
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Display a window of pages around the current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <Button
                        variant={pageNum === page ? "default" : "outline"}
                        size="icon"
                        onClick={() => handlePageChange(pageNum)}
                        className="h-8 w-8"
                      >
                        {pageNum}
                      </Button>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="h-8 w-8"
                  >
                    <PaginationNext className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        )}
      </Card>

      {onImport && (
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("back")}
          </Button>
          
          <Button 
            onClick={onImport} 
            disabled={policies.length === 0}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {invalidPolicies.length > 0 
              ? t("importWithErrors") 
              : t("importPolicies")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PolicyImportReview;
