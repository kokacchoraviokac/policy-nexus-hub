
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ImportedPolicyData, InvalidPolicy, Policy } from "@/types/policies";
import { Loader2, AlertCircle, X, Check } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { formatDateString, formatCurrency } from "@/utils/formatters";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Pagination from "@/components/ui/pagination";

interface ValidListProps {
  policies: Partial<Policy>[];
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  t: (key: string, options?: any) => string;
  formatDateString: (dateString: string) => string;
  formatCurrency: (amount: number, currency?: string) => string;
}

interface InvalidListProps {
  invalidPolicies: InvalidPolicy[];
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  t: (key: string, options?: any) => string;
}

const ValidPoliciesList: React.FC<ValidListProps> = ({ 
  policies, 
  currentPage, 
  itemsPerPage, 
  onPageChange, 
  totalPages,
  t,
  formatDateString,
  formatCurrency 
}) => {
  // Calculate start and end indices based on pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, policies.length);
  const displayedPolicies = policies.slice(startIndex, endIndex);

  if (policies.length === 0) {
    return (
      <Alert variant="default" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("noValidPolicies")}</AlertTitle>
        <AlertDescription>
          {t("noValidPoliciesDescription")}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("policyNumber")}</TableHead>
              <TableHead>{t("policyType")}</TableHead>
              <TableHead>{t("client")}</TableHead>
              <TableHead>{t("insurer")}</TableHead>
              <TableHead>{t("startDate")}</TableHead>
              <TableHead>{t("expiryDate")}</TableHead>
              <TableHead>{t("premium")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedPolicies.map((policy, index) => (
              <TableRow key={`${policy.policy_number}-${index}`}>
                <TableCell>{policy.policy_number}</TableCell>
                <TableCell>{policy.policy_type}</TableCell>
                <TableCell>{policy.policyholder_name || policy.client_name}</TableCell>
                <TableCell>{policy.insurer_name}</TableCell>
                <TableCell>{policy.start_date ? formatDateString(policy.start_date) : ''}</TableCell>
                <TableCell>{policy.expiry_date ? formatDateString(policy.expiry_date) : ''}</TableCell>
                <TableCell>
                  {policy.premium ? formatCurrency(policy.premium, policy.currency) : ''}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const InvalidPoliciesList: React.FC<InvalidListProps> = ({ 
  invalidPolicies, 
  currentPage, 
  itemsPerPage, 
  onPageChange, 
  totalPages,
  t 
}) => {
  // Calculate start and end indices based on pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, invalidPolicies.length);
  const displayedPolicies = invalidPolicies.slice(startIndex, endIndex);

  if (invalidPolicies.length === 0) {
    return (
      <Alert variant="default" className="mt-4">
        <Check className="h-4 w-4" />
        <AlertTitle>{t("noInvalidPolicies")}</AlertTitle>
        <AlertDescription>
          {t("allPoliciesValid")}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("policyNumber")}</TableHead>
              <TableHead>{t("client")}</TableHead>
              <TableHead>{t("errors")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedPolicies.map((invalidPolicy, index) => (
              <TableRow key={`invalid-${index}`}>
                <TableCell>{invalidPolicy.policy.policy_number || t("unknown")}</TableCell>
                <TableCell>{invalidPolicy.policy.policyholder_name || invalidPolicy.policy.client_name || t("unknown")}</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside text-sm">
                    {invalidPolicy.errors.map((error, errorIndex) => (
                      <li key={errorIndex} className="text-destructive">
                        {error}
                      </li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

interface PolicyImportReviewProps {
  policies: Partial<Policy>[];
  invalidPolicies: InvalidPolicy[];
  onBack: () => void;
  onImport: () => void;
}

const PolicyImportReview: React.FC<PolicyImportReviewProps> = ({ policies, invalidPolicies, onBack, onImport }) => {
  const { t, formatDate } = useLanguage();
  const [activeTab, setActiveTab] = useState("valid");
  
  // Pagination state for valid policies
  const [validPage, setValidPage] = useState(1);
  const validItemsPerPage = 10;
  const validTotalPages = Math.ceil(policies.length / validItemsPerPage);
  
  // Pagination state for invalid policies
  const [invalidPage, setInvalidPage] = useState(1);
  const invalidItemsPerPage = 10;
  const invalidTotalPages = Math.ceil(invalidPolicies.length / invalidItemsPerPage);

  // Reset pagination when data changes
  useEffect(() => {
    setValidPage(1);
    setInvalidPage(1);
  }, [policies, invalidPolicies]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{t("reviewImportedPolicies")}</h3>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onBack}>
            {t("back")}
          </Button>
          <Button onClick={onImport} disabled={policies.length === 0}>
            {t("importPolicies", { count: policies.length })}
          </Button>
        </div>
      </div>

      <div className="flex space-x-4 text-sm text-muted-foreground mb-2">
        <div className="flex items-center">
          <Check className="text-success mr-1 h-4 w-4" />
          <span>{t("validPolicies")}: {policies.length}</span>
        </div>
        <div className="flex items-center">
          <X className="text-destructive mr-1 h-4 w-4" />
          <span>{t("invalidPolicies")}: {invalidPolicies.length}</span>
        </div>
      </div>

      <Tabs defaultValue="valid" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-[250px] grid-cols-2">
          <TabsTrigger value="valid">{t("validPolicies")}</TabsTrigger>
          <TabsTrigger value="invalid">{t("invalidPolicies")}</TabsTrigger>
        </TabsList>

        <TabsContent value="valid" className="pt-4">
          <ValidPoliciesList 
            policies={policies}
            currentPage={validPage}
            itemsPerPage={validItemsPerPage}
            onPageChange={setValidPage}
            totalPages={validTotalPages}
            t={t}
            formatDateString={formatDateString}
            formatCurrency={formatCurrency}
          />
          
          {validTotalPages > 1 && (
            <Pagination 
              currentPage={validPage}
              totalPages={validTotalPages}
              onPageChange={setValidPage}
              itemsCount={policies.length}
              itemsPerPage={validItemsPerPage}
            />
          )}
        </TabsContent>

        <TabsContent value="invalid" className="pt-4">
          <InvalidPoliciesList 
            invalidPolicies={invalidPolicies}
            currentPage={invalidPage}
            itemsPerPage={invalidItemsPerPage}
            onPageChange={setInvalidPage}
            totalPages={invalidTotalPages}
            t={t}
          />
          
          {invalidTotalPages > 1 && (
            <Pagination
              currentPage={invalidPage}
              totalPages={invalidTotalPages}
              onPageChange={setInvalidPage}
              itemsCount={invalidPolicies.length}
              itemsPerPage={invalidItemsPerPage}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PolicyImportReview;
