
import React, { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Upload, AlertTriangle, Check, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ValidatedPolicy {
  policy: any;
  isValid: boolean;
  errors: string[];
}

interface PolicyImportReviewProps {
  policies: any[];
  onBack: () => void;
  onImport: () => void;
}

const PolicyImportReview: React.FC<PolicyImportReviewProps> = ({
  policies,
  onBack,
  onImport
}) => {
  const { t } = useLanguage();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  // Validate policies
  const validatedPolicies: ValidatedPolicy[] = useMemo(() => {
    return policies.map(policy => {
      const errors: string[] = [];
      
      // Required fields to check
      const requiredFields = [
        { field: 'policy_number', label: t("policyNumber") },
        { field: 'insurer_name', label: t("insurer") },
        { field: 'policyholder_name', label: t("policyholder") },
        { field: 'start_date', label: t("startDate") },
        { field: 'expiry_date', label: t("expiryDate") },
        { field: 'premium', label: t("premium") },
        { field: 'currency', label: t("currency") }
      ];
      
      // Check required fields
      requiredFields.forEach(({ field, label }) => {
        if (!policy[field]) {
          errors.push(`${label} ${t("isRequired")}`);
        }
      });
      
      // Validate date formats
      const dateFields = [
        { field: 'start_date', label: t("startDate") },
        { field: 'expiry_date', label: t("expiryDate") }
      ];
      
      dateFields.forEach(({ field, label }) => {
        if (policy[field] && !/^\d{4}-\d{2}-\d{2}$/.test(policy[field])) {
          errors.push(`${label} ${t("invalidDateFormat")}`);
        }
      });
      
      // Validate premium is a number
      if (policy.premium && isNaN(Number(policy.premium))) {
        errors.push(`${t("premium")} ${t("mustBeNumber")}`);
      }
      
      // Validate commission percentage is a number if present
      if (policy.commission_percentage && isNaN(Number(policy.commission_percentage))) {
        errors.push(`${t("commissionPercentage")} ${t("mustBeNumber")}`);
      }
      
      return {
        policy,
        isValid: errors.length === 0,
        errors
      };
    });
  }, [policies, t]);
  
  // Count of valid and invalid policies
  const validCount = validatedPolicies.filter(p => p.isValid).length;
  const invalidCount = validatedPolicies.length - validCount;
  
  // Paginate policies
  const paginatedPolicies = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return validatedPolicies.slice(start, end);
  }, [validatedPolicies, page, pageSize]);
  
  const totalPages = Math.ceil(validatedPolicies.length / pageSize);
  
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };
  
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };
  
  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{t("reviewPolicies")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("reviewPoliciesDescription")}
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-50 p-3 rounded-md text-center">
          <p className="text-sm text-muted-foreground">{t("totalPolicies")}</p>
          <p className="text-xl font-semibold">{validatedPolicies.length}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-md text-center">
          <p className="text-sm text-green-600">{t("validPolicies")}</p>
          <p className="text-xl font-semibold text-green-700">{validCount}</p>
        </div>
        <div className={`p-3 rounded-md text-center ${invalidCount > 0 ? 'bg-red-50' : 'bg-slate-50'}`}>
          <p className={`text-sm ${invalidCount > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>{t("invalidPolicies")}</p>
          <p className={`text-xl font-semibold ${invalidCount > 0 ? 'text-red-700' : 'text-slate-700'}`}>{invalidCount}</p>
        </div>
      </div>
      
      {invalidCount > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>
            {t("importContainsErrors", { count: invalidCount })}
          </AlertDescription>
        </Alert>
      )}
      
      <ScrollArea className="h-[300px] border rounded-md">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead className="w-[50px]">{t("status")}</TableHead>
              <TableHead>{t("policyNumber")}</TableHead>
              <TableHead>{t("insurer")}</TableHead>
              <TableHead>{t("policyholder")}</TableHead>
              <TableHead>{t("premium")}</TableHead>
              <TableHead>{t("startDate")}</TableHead>
              <TableHead>{t("expiryDate")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPolicies.map((item, index) => (
              <TableRow key={index} className={!item.isValid ? 'bg-red-50' : ''}>
                <TableCell>
                  {item.isValid ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Check className="h-3 w-3 mr-1" />
                      {t("valid")}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      <X className="h-3 w-3 mr-1" />
                      {t("invalid")}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{item.policy.policy_number || '-'}</span>
                    {!item.isValid && (
                      <div className="mt-1">
                        {item.errors.map((error, i) => (
                          <div key={i} className="text-xs text-red-600">{error}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{item.policy.insurer_name || '-'}</TableCell>
                <TableCell>{item.policy.policyholder_name || '-'}</TableCell>
                <TableCell>
                  {item.policy.premium 
                    ? `${item.policy.premium} ${item.policy.currency || ''}`
                    : '-'
                  }
                </TableCell>
                <TableCell>{item.policy.start_date || '-'}</TableCell>
                <TableCell>{item.policy.expiry_date || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrevPage} 
            disabled={page === 1}
          >
            {t("previous")}
          </Button>
          <span className="text-sm">
            {t("page")} {page} {t("of")} {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextPage} 
            disabled={page === totalPages}
          >
            {t("next")}
          </Button>
        </div>
      )}
      
      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription className="text-blue-800 text-sm">
          {invalidCount > 0 
            ? t("importContainsErrorsWarning") 
            : t("allPoliciesValidProceed")}
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-between items-center">
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </Button>
        
        <Button 
          onClick={onImport}
          className="flex items-center gap-2"
          variant={invalidCount > 0 ? "outline" : "default"}
        >
          <Upload className="h-4 w-4" />
          {invalidCount > 0 
            ? t("importWithErrors") 
            : t("importPolicies")}
        </Button>
      </div>
    </div>
  );
};

export default PolicyImportReview;
