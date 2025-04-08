
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Policy } from "@/types/policies";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PolicyImportReviewProps {
  policies: Partial<Policy>[];
  invalidPolicies: { policy: Partial<Policy>; errors: any[] }[];
  onBack?: () => void;
  onImport?: () => void;
}

const PolicyImportReview: React.FC<PolicyImportReviewProps> = ({
  policies,
  invalidPolicies,
  onBack,
  onImport,
}) => {
  const { t, formatDate, formatCurrency } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [displayInvalid, setDisplayInvalid] = useState(false);
  
  const pageSize = 5;
  const totalItems = displayInvalid ? invalidPolicies.length : policies.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  
  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    if (displayInvalid) {
      return invalidPolicies.slice(startIndex, endIndex);
    } else {
      return policies.slice(startIndex, endIndex);
    }
  };
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // Page numbering logic for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  const renderStatusBadge = (item: any) => {
    if (displayInvalid) {
      return (
        <Badge variant="destructive" className="gap-1.5">
          <X className="h-3.5 w-3.5" />
          {t("invalid")}
        </Badge>
      );
    }
    
    return (
      <Badge variant="success" className="gap-1.5">
        <CheckCircle className="h-3.5 w-3.5" />
        {t("valid")}
      </Badge>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">
            {t("reviewPolicies")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("reviewPoliciesDescription")}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={displayInvalid ? "outline" : "default"}
            size="sm"
            onClick={() => {
              setDisplayInvalid(false);
              setCurrentPage(1);
            }}
            className="text-xs gap-1.5"
          >
            <FileCheck className="h-4 w-4" />
            {t("valid")} ({policies.length})
          </Button>
          
          <Button
            variant={displayInvalid ? "default" : "outline"}
            size="sm"
            disabled={invalidPolicies.length === 0}
            onClick={() => {
              if (invalidPolicies.length > 0) {
                setDisplayInvalid(true);
                setCurrentPage(1);
              }
            }}
            className="text-xs gap-1.5"
          >
            <AlertTriangle className="h-4 w-4" />
            {t("invalid")} ({invalidPolicies.length})
          </Button>
        </div>
      </div>
      
      {invalidPolicies.length > 0 && !displayInvalid && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("importContainsErrors", { count: invalidPolicies.length })}</AlertTitle>
          <AlertDescription>
            {t("importContainsErrorsWarning")}
          </AlertDescription>
        </Alert>
      )}
      
      {invalidPolicies.length === 0 && !displayInvalid && (
        <Alert variant="success" className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">{t("allPoliciesValid")}</AlertTitle>
          <AlertDescription className="text-green-600">
            {t("allPoliciesValidProceed")}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("policyNumber")}</TableHead>
              <TableHead>{t("policyholder")}</TableHead>
              <TableHead>{t("insurer")}</TableHead>
              <TableHead>{t("startDate")}</TableHead>
              <TableHead>{t("expiryDate")}</TableHead>
              <TableHead className="text-right">{t("premium")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getCurrentPageItems().map((item, index) => {
              const policy = displayInvalid ? item.policy : item;
              const errors = displayInvalid ? item.errors : [];
              
              return (
                <TableRow key={index}>
                  <TableCell>
                    {renderStatusBadge(item)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {policy.policy_number}
                    {displayInvalid && errors && errors.length > 0 && (
                      <div className="text-xs text-destructive mt-1">
                        {errors.map((err, i) => (
                          <div key={i}>
                            {err.field ? `${err.field}: ${err.message}` : err.message || err}
                          </div>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{policy.policyholder_name}</TableCell>
                  <TableCell>{policy.insurer_name}</TableCell>
                  <TableCell>
                    {policy.start_date ? formatDate(policy.start_date) : "-"}
                  </TableCell>
                  <TableCell>
                    {policy.expiry_date ? formatDate(policy.expiry_date) : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {policy.premium
                      ? formatCurrency(policy.premium, policy.currency || "EUR")
                      : "-"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {getPageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === 'ellipsis' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => handlePageChange(page as number)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t("back")}
        </Button>
        
        <Button
          onClick={onImport}
          disabled={policies.length === 0}
          className={invalidPolicies.length > 0 ? "bg-amber-500 hover:bg-amber-600" : ""}
        >
          {invalidPolicies.length > 0 ? t("importWithErrors") : t("importPolicies")}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex justify-between text-sm text-muted-foreground mt-2">
        <div>
          {t("totalPolicies")}: {policies.length + invalidPolicies.length}
        </div>
        <div className="flex gap-4">
          <span>{t("validPolicies")}: {policies.length}</span>
          <span>{t("invalidPolicies")}: {invalidPolicies.length}</span>
        </div>
      </div>
    </div>
  );
};

export default PolicyImportReview;
