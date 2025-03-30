
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import FinancialReportFilters from "@/components/reports/financial/FinancialReportFilters";
import FinancialReportTable from "@/components/reports/financial/FinancialReportTable";
import FinancialReportSummary from "@/components/reports/financial/FinancialReportSummary";
import { FinancialTransaction } from "@/utils/reports/financialReportUtils";
import { useToast } from "@/hooks/use-toast";

const FinancialReport = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(new Date().setDate(1)), // First day of current month
    new Date()
  ]);
  const [transactionType, setTransactionType] = useState<string | null>("all");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  
  // Mock data for demonstration
  const mockTransactions: FinancialTransaction[] = [
    {
      id: "1",
      date: "2023-12-15T10:30:00Z",
      description: "Commission Payment - Policy #12345",
      type: "income",
      category: "commission",
      reference: "INV-2023-001",
      status: "completed",
      amount: 1250.00,
      currency: "EUR"
    },
    {
      id: "2",
      date: "2023-12-10T11:15:00Z",
      description: "Premium Collection - Client ABC",
      type: "income",
      category: "premium",
      reference: "PMT-2023-123",
      status: "completed",
      amount: 3500.00,
      currency: "EUR"
    },
    {
      id: "3",
      date: "2023-12-05T09:45:00Z",
      description: "Office Rent Payment",
      type: "expense",
      category: "operational",
      reference: "EXP-2023-42",
      status: "completed",
      amount: 1800.00,
      currency: "EUR"
    },
    {
      id: "4",
      date: "2023-12-01T14:00:00Z",
      description: "Agent Commission - John Doe",
      type: "expense",
      category: "commission",
      reference: "PAY-2023-89",
      status: "pending",
      amount: 950.00,
      currency: "EUR"
    }
  ];
  
  const handleExport = () => {
    setIsLoading(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: t("exportComplete"),
        description: t("financialReportExported"),
      });
    }, 1500);
  };
  
  const handleBackToReports = () => {
    navigate("/reports");
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        onClick={handleBackToReports}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        {t("backToReports")}
      </Button>
      
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{t("financialReport")}</h1>
        <p className="text-muted-foreground">
          {t("financialReportDescription")}
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <FinancialReportFilters 
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          transactionType={transactionType}
          onTransactionTypeChange={setTransactionType}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        
        <Button 
          onClick={handleExport} 
          disabled={isLoading}
          className="whitespace-nowrap"
        >
          <FileDown className="mr-2 h-4 w-4" />
          {isLoading ? t("exporting") : t("exportCSV")}
        </Button>
      </div>
      
      <FinancialReportSummary data={mockTransactions} isLoading={false} />
      
      <Card>
        <CardHeader>
          <CardTitle>{t("transactionHistory")}</CardTitle>
          <CardDescription>
            {t("viewAllFinancialTransactions")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FinancialReportTable 
            data={mockTransactions} 
            isLoading={isLoading} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReport;
