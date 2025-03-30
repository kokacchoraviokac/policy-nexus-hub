
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  Download, 
  Search, 
  CheckCircle, 
  Loader2, 
  FileText,
  LinkIcon 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBankTransactions } from "@/hooks/useBankTransactions";

const BankStatementDetail = () => {
  const { statementId } = useParams<{ statementId: string }>();
  const { t, formatDate, formatCurrency } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // This is a mock for demonstration. In a real implementation, you'd fetch the statement details.
  const mockStatement = {
    id: statementId || "1",
    bank_name: "UniCredit",
    account_number: "170-123456789-01",
    statement_date: new Date().toISOString(),
    starting_balance: 10000,
    ending_balance: 12500,
    status: "processed" as const,
    file_path: "/statements/statement1.pdf",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    company_id: "company1"
  };
  
  const { 
    transactions, 
    isLoading, 
    matchTransaction, 
    isMatching, 
    ignoreTransaction, 
    isIgnoring 
  } = useBankTransactions(statementId || "");
  
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = !searchTerm || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      String(transaction.amount).includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleBackClick = () => {
    navigate('/finances/statements');
  };
  
  const handleDownloadStatement = () => {
    // Mock download functionality
    toast({
      title: t("downloadStarted"),
      description: t("statementDownloadStarted"),
    });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };
  
  const handleMatchTransaction = (transactionId: string) => {
    // In a real implementation, you'd open a dialog to select a policy
    // For now, we'll just use a mock policy ID
    const mockPolicyId = "policy1";
    matchTransaction({ transactionId, policyId: mockPolicyId });
  };
  
  const handleIgnoreTransaction = (transactionId: string) => {
    ignoreTransaction(transactionId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-fit"
          onClick={handleBackClick}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t("backToStatements")}
        </Button>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadStatement}
          >
            <Download className="mr-2 h-4 w-4" />
            {t("downloadStatement")}
          </Button>
          
          {mockStatement.status === "in_progress" && (
            <Button
              size="sm"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {t("processStatement")}
            </Button>
          )}
          
          {mockStatement.status === "processed" && (
            <Button
              size="sm"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {t("confirmStatement")}
            </Button>
          )}
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>{t("statementDetails")}</CardTitle>
            <Badge variant={
              mockStatement.status === "in_progress" ? 'secondary' : 
              mockStatement.status === "processed" ? 'outline' : 
              'default'
            }>
              {t(mockStatement.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("bankName")}</h4>
                  <p className="font-medium">{mockStatement.bank_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("accountNumber")}</h4>
                  <p className="font-medium">{mockStatement.account_number}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("statementDate")}</h4>
                  <p className="font-medium">{formatDate(mockStatement.statement_date)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("documentUploadDate")}</h4>
                  <p className="font-medium">{formatDate(mockStatement.created_at)}</p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("startingBalance")}</h4>
                  <p className="font-medium">{formatCurrency(mockStatement.starting_balance)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("endingBalance")}</h4>
                  <p className="font-medium">{formatCurrency(mockStatement.ending_balance)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("netChange")}</h4>
                  <p className={`font-medium ${mockStatement.ending_balance - mockStatement.starting_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(mockStatement.ending_balance - mockStatement.starting_balance)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("transactionCount")}</h4>
                  <p className="font-medium">{transactions.length}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t("transactions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("searchTransactions")}
                className="pl-8"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allTransactions")}</SelectItem>
                <SelectItem value="unmatched">{t("unmatched")}</SelectItem>
                <SelectItem value="matched">{t("matched")}</SelectItem>
                <SelectItem value="ignored">{t("ignored")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center p-8 border rounded-lg bg-background">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">{t("noTransactionsFound")}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t("adjustFiltersToSeeMore")}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("date")}</TableHead>
                    <TableHead>{t("description")}</TableHead>
                    <TableHead>{t("reference")}</TableHead>
                    <TableHead>{t("amount")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.transaction_date)}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.reference || "-"}</TableCell>
                      <TableCell className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          transaction.status === 'unmatched' ? 'secondary' : 
                          transaction.status === 'matched' ? 'default' : 
                          'outline'
                        }>
                          {t(transaction.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {transaction.status === 'unmatched' && (
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMatchTransaction(transaction.id)}
                              disabled={isMatching}
                            >
                              <LinkIcon className="mr-2 h-4 w-4" />
                              {t("linkToPolicy")}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleIgnoreTransaction(transaction.id)}
                              disabled={isIgnoring}
                            >
                              {t("ignore")}
                            </Button>
                          </div>
                        )}
                        {transaction.status === 'matched' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // View linked policy
                              navigate(`/policies/${transaction.matched_policy_id}`);
                            }}
                          >
                            {t("viewPolicy")}
                          </Button>
                        )}
                        {transaction.status === 'ignored' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Reset to unmatched
                              // This would need to be implemented in the hook
                            }}
                          >
                            {t("resetStatus")}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BankStatementDetail;
