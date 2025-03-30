
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Upload, FileUp } from "lucide-react";
import { useBankStatements } from "@/hooks/useBankStatements";
import BankStatementsFilters from "@/components/finances/statements/BankStatementsFilters";
import BankStatementsList from "@/components/finances/statements/BankStatementsList";
import BankStatementUploadDialog from "@/components/finances/statements/BankStatementUploadDialog";

const BankStatements = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [bankFilter, setBankFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null
  });
  const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>(false);
  
  const { 
    statements, 
    isLoading, 
    refetch,
    processStatement,
    isProcessing,
    confirmStatement,
    isConfirming
  } = useBankStatements({
    searchTerm,
    bankName: bankFilter !== "all" ? bankFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    dateFrom: dateRange.from,
    dateTo: dateRange.to
  });

  const handleViewStatement = (statementId: string) => {
    navigate(`/finances/statements/${statementId}`);
  };
  
  const handleProcessStatement = (statementId: string) => {
    processStatement(statementId);
  };
  
  const handleConfirmStatement = (statementId: string) => {
    confirmStatement(statementId);
  };
  
  const handleUploadComplete = () => {
    toast({
      title: t("statementUploaded"),
      description: t("statementUploadedSuccess"),
    });
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("bankStatements")}</h1>
          <p className="text-muted-foreground">
            {t("bankStatementsDescription")}
          </p>
        </div>
        
        <Button onClick={() => setUploadDialogOpen(true)}>
          <FileUp className="mr-2 h-4 w-4" />
          {t("uploadStatement")}
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <BankStatementsFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            bankFilter={bankFilter}
            onBankFilterChange={setBankFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onRefresh={() => refetch()}
          />
          
          <div className="mt-6">
            <BankStatementsList 
              statements={statements}
              isLoading={isLoading}
              onViewStatement={handleViewStatement}
              onProcessStatement={handleProcessStatement}
              onConfirmStatement={handleConfirmStatement}
              isProcessing={isProcessing}
              isConfirming={isConfirming}
            />
          </div>
        </CardContent>
      </Card>
      
      <BankStatementUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
};

export default BankStatements;
