
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Policy } from "@/types/policies";
import { ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Save } from "lucide-react";

interface PolicyImportReviewProps {
  policies: Partial<Policy>[];
  invalidPolicies: { policy: Partial<Policy>; errors: string[] }[];
  onBack?: () => void;
  onImport?: () => void;
}

const PolicyImportReview: React.FC<PolicyImportReviewProps> = ({
  policies,
  invalidPolicies,
  onBack,
  onImport
}) => {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingInvalid, setViewingInvalid] = useState(false);
  
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  
  const currentPolicies = viewingInvalid 
    ? invalidPolicies.slice(startIndex, startIndex + itemsPerPage) 
    : policies.slice(startIndex, startIndex + itemsPerPage);
  
  const totalPages = viewingInvalid
    ? Math.ceil(invalidPolicies.length / itemsPerPage)
    : Math.ceil(policies.length / itemsPerPage);
  
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  
  const toggleView = () => {
    setViewingInvalid(!viewingInvalid);
    setCurrentPage(1);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium mb-1">{t("reviewPolicies")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("reviewPoliciesDescription")}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <div className="bg-green-100 text-green-700 font-medium rounded-md py-1 px-2 text-xs flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              {policies.length} {t("validPolicies")}
            </div>
          </div>
          
          {invalidPolicies.length > 0 && (
            <div className="flex items-center">
              <div className="bg-amber-100 text-amber-700 font-medium rounded-md py-1 px-2 text-xs flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {invalidPolicies.length} {t("invalidPolicies")}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {policies.length === 0 && invalidPolicies.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p>{t("noPoliciesFound")}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {invalidPolicies.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800">
                  {t("importContainsErrors", { count: invalidPolicies.length })}
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  {t("importContainsErrorsWarning")}
                </p>
              </div>
            </div>
          )}
          
          {invalidPolicies.length === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-green-800">
                  {t("allPoliciesValidProceed")}
                </h4>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <Button
                size="sm"
                variant={viewingInvalid ? "outline" : "default"}
                onClick={() => !viewingInvalid || toggleView()}
                disabled={policies.length === 0}
              >
                {t("valid")}
              </Button>
              <Button
                size="sm"
                variant={viewingInvalid ? "default" : "outline"}
                onClick={() => viewingInvalid || toggleView()}
                disabled={invalidPolicies.length === 0}
              >
                {t("invalid")}
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <Label className="text-sm">
                {t("page")} {currentPage} {t("of")} {totalPages || 1}
              </Label>
              
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <Card>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">{t("policyNumber")}</TableHead>
                    <TableHead>{t("insurer")}</TableHead>
                    <TableHead>{t("policyholder")}</TableHead>
                    <TableHead>{t("startDate")}</TableHead>
                    <TableHead>{t("expiryDate")}</TableHead>
                    <TableHead>{t("premium")}</TableHead>
                    {viewingInvalid && (
                      <TableHead>{t("errors")}</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPolicies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={viewingInvalid ? 7 : 6} className="text-center py-6">
                        {viewingInvalid
                          ? t("noInvalidPolicies")
                          : t("noValidPolicies")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    viewingInvalid
                      ? currentPolicies.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {item.policy?.policy_number || '-'}
                            </TableCell>
                            <TableCell>{item.policy?.insurer_name || '-'}</TableCell>
                            <TableCell>{item.policy?.policyholder_name || '-'}</TableCell>
                            <TableCell>{item.policy?.start_date || '-'}</TableCell>
                            <TableCell>{item.policy?.expiry_date || '-'}</TableCell>
                            <TableCell>
                              {item.policy?.premium 
                                ? `${item.policy.premium} ${item.policy.currency}` 
                                : '-'}
                            </TableCell>
                            <TableCell className="text-red-500 text-xs">
                              <ul className="list-disc pl-4">
                                {item.errors.map((error, i) => (
                                  <li key={i}>{error}</li>
                                ))}
                              </ul>
                            </TableCell>
                          </TableRow>
                        ))
                      : currentPolicies.map((policy, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {policy.policy_number || '-'}
                            </TableCell>
                            <TableCell>{policy.insurer_name || '-'}</TableCell>
                            <TableCell>{policy.policyholder_name || '-'}</TableCell>
                            <TableCell>{policy.start_date || '-'}</TableCell>
                            <TableCell>{policy.expiry_date || '-'}</TableCell>
                            <TableCell>
                              {policy.premium 
                                ? `${policy.premium} ${policy.currency}` 
                                : '-'}
                            </TableCell>
                          </TableRow>
                        ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
          
          <div className="flex justify-between mt-6">
            {onBack && (
              <Button
                variant="outline"
                onClick={onBack}
              >
                {t("back")}
              </Button>
            )}
            
            {onImport && policies.length > 0 && (
              <Button
                onClick={onImport}
                className="ml-auto"
              >
                <Save className="mr-2 h-4 w-4" />
                {invalidPolicies.length > 0 
                  ? t("importWithErrors") 
                  : t("importPolicies")}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PolicyImportReview;
