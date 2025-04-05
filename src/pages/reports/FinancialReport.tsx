
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileDown, Filter, FileText, Loader2 } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { useFinancialReport } from '@/hooks/reports/useFinancialReport';
import FinancialReportFilters from './components/FinancialReportFilters';
import { formatCurrency } from '@/utils/reports/financialReportUtils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FinancialReportData } from '@/types/reports';

const FinancialReport: React.FC = () => {
  const { t } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);
  
  const {
    filters,
    updateFilters,
    runReport,
    data,
    loading
  } = useFinancialReport();
  
  // Mock transactions data
  const mockTransactions: FinancialTransaction[] = [
    { id: "1", date: "2023-01-15", description: "Policy premium", amount: 1500, reference: "POL-001", status: "completed" },
    { id: "2", date: "2023-01-20", description: "Commission payment", amount: 300, reference: "COM-001", status: "completed" },
    { id: "3", date: "2023-01-25", description: "Claims payout", amount: -750, reference: "CLM-001", status: "pending" }
  ];
  
  // Add mock transactions to the data
  const dataWithTransactions: FinancialReportData[] = data.map(item => ({
    ...item,
    transactions: mockTransactions
  }));
  
  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Mock export delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would normally call exportToExcel from your hook
      const csvContent = "data:text/csv;charset=utf-8," + 
        "ID,Date,Description,Type,Reference,Amount,Status\n" +
        dataWithTransactions.map(row => {
          return `${row.id},"${row.date}","${row.description}","${row.type}","${row.reference}",${row.amount},"${row.status}"`;
        }).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "financial_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };
  
  const filteredData = activeTab === 'all' 
    ? dataWithTransactions 
    : dataWithTransactions.filter(item => item.type === activeTab);
  
  const categories = ["all", ...new Set(dataWithTransactions.map(item => item.type))];
  
  return (
    <div className="container py-6 mx-auto">
      <PageHeader title={t("financialReport")} />
      
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>{t("financialReport")}</CardTitle>
              <CardDescription>{t("viewFinancialInformation")}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {t("filters")}
              </Button>
              <Button 
                size="sm" 
                onClick={handleExport}
                disabled={isExporting || loading || dataWithTransactions.length === 0}
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileDown className="h-4 w-4 mr-2" />
                )}
                {t("export")}
              </Button>
            </div>
          </CardHeader>
          
          {showFilters && (
            <CardContent className="border-b pb-6">
              <FinancialReportFilters 
                filters={filters}
                onChange={updateFilters}
                onApply={() => runReport()}
              />
            </CardContent>
          )}
          
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : dataWithTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">{t("noTransactionsFound")}</h3>
                <p className="text-sm text-muted-foreground max-w-md mt-1">
                  {t("noTransactionsFoundDescription")}
                </p>
              </div>
            ) : (
              <>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <div className="px-6 pt-6">
                    <TabsList>
                      {categories.map(category => (
                        <TabsTrigger key={category} value={category}>
                          {category === 'all' ? t('all') : t(category.toLowerCase())}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                  
                  <TabsContent value={activeTab} className="pt-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("date")}</TableHead>
                          <TableHead>{t("description")}</TableHead>
                          <TableHead>{t("reference")}</TableHead>
                          <TableHead className="text-right">{t("amount")}</TableHead>
                          <TableHead>{t("status")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>
                              <div className="font-medium">{transaction.description}</div>
                              <div className="text-xs text-muted-foreground">{t(transaction.type)}</div>
                            </TableCell>
                            <TableCell>{transaction.reference}</TableCell>
                            <TableCell className={`text-right ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(transaction.amount)}
                            </TableCell>
                            <TableCell>
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs 
                                ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                  transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-gray-100 text-gray-800'}`}>
                                {t(transaction.status)}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialReport;

interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  reference: string;
  status: string;
}
