
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBankStatements } from "@/hooks/useBankStatements";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, Download, ArrowUpDown, Filter } from "lucide-react";
import BankStatementsFilters from "@/components/finances/statements/BankStatementsFilters";
import BankStatementsList from "@/components/finances/statements/BankStatementsList";
import BankStatementUploadDialog from "@/components/finances/statements/BankStatementUploadDialog";

// Add a type definition for the needed props to avoid TypeScript errors
interface BankStatementsListProps {
  statements: any[];
  isLoading: boolean;
  onStatementClick: (statementId: string) => void;
  onProcess: (statementId: string) => void;
  onConfirm: (statementId: string) => void;
  isProcessing: boolean;
  isConfirming: boolean;
}

const BankStatements = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [showFilters, setShowFilters] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [bankFilter, setBankFilter] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  
  const { 
    statements, 
    totalCount, 
    isLoading, 
    refetch, 
    processStatement, 
    isProcessing,
    confirmStatement,
    isConfirming
  } = useBankStatements({
    searchTerm,
    status: statusFilter !== "all" ? statusFilter : undefined,
    bankName: bankFilter || undefined,
    dateFrom,
    dateTo
  });
  
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setBankFilter("");
    setDateFrom(null);
    setDateTo(null);
  };
  
  const handleStatementClick = (statementId: string) => {
    navigate(`/finances/statements/${statementId}`);
  };
  
  const handleUploadComplete = () => {
    refetch();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t("bankStatements")}</h1>
        <div className="flex space-x-2">
          <Button 
            onClick={() => navigate("/finances")} 
            variant="outline"
          >
            {t("backToFinances")}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {t("filters")}
          </Button>
          <Button onClick={() => setShowUploadDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("uploadStatement")}
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <BankStatementsFilters 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          bankFilter={bankFilter}
          onBankChange={setBankFilter}
          dateFrom={dateFrom}
          onDateFromChange={setDateFrom}
          dateTo={dateTo}
          onDateToChange={setDateTo}
          onClearFilters={handleClearFilters}
        />
      )}
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("statementsList")}</CardTitle>
          <div className="text-sm text-muted-foreground">
            {totalCount} {t("statements")}
          </div>
        </CardHeader>
        <CardContent>
          <BankStatementsList 
            statements={statements}
            isLoading={isLoading}
            onStatementClick={handleStatementClick}
            onProcess={processStatement}
            onConfirm={confirmStatement}
            isProcessing={isProcessing}
            isConfirming={isConfirming}
          />
        </CardContent>
      </Card>
      
      <BankStatementUploadDialog 
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
};

export default BankStatements;
