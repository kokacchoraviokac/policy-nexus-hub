
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, Filter, Download, Search, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useClientReport, ClientReportFilters } from "@/hooks/useClientReport";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SearchInput from "@/components/ui/search-input";
import DataTable from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import * as XLSX from "xlsx";

// Component to display summary metrics
const ClientReportSummary = ({ summary }) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="text-sm font-medium text-muted-foreground mb-1">{t("totalClients")}</div>
          <div className="text-2xl font-bold">{summary.totalClients}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-sm font-medium text-muted-foreground mb-1">{t("activeClients")}</div>
          <div className="text-2xl font-bold text-green-600">{summary.activeClients}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-sm font-medium text-muted-foreground mb-1">{t("inactiveClients")}</div>
          <div className="text-2xl font-bold text-gray-500">{summary.inactiveClients}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-sm font-medium text-muted-foreground mb-1">{t("avgPoliciesPerClient")}</div>
          <div className="text-2xl font-bold">{summary.averagePoliciesPerClient.toFixed(1)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-sm font-medium text-muted-foreground mb-1">{t("totalPolicies")}</div>
          <div className="text-2xl font-bold">{summary.totalPolicies}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-sm font-medium text-muted-foreground mb-1">{t("totalPremium")}</div>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalPremium)}</div>
        </CardContent>
      </Card>
    </div>
  );
};

const ClientsReport = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");
  const [filters, setFilters] = useState<ClientReportFilters>({
    dateRange: undefined,
    status: 'all',
    searchTerm: "",
  });
  
  const { clientsData, summary, isLoading, error } = useClientReport(filters);

  const handleDateRangeChange = (range: DateRange) => {
    setFilters(prev => ({ ...prev, dateRange: range }));
  };

  const handleStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, status: value as 'all' | 'active' | 'inactive' }));
  };

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, searchTerm: value }));
  };

  const handleBackToReports = () => {
    navigate("/reports");
  };
  
  const handleExport = () => {
    // Prepare data for export
    const exportData = clientsData.map(client => ({
      Name: client.name,
      'Contact Person': client.contact_person || '',
      Email: client.email || '',
      Phone: client.phone || '',
      City: client.city || '',
      Status: client.is_active ? t('active') : t('inactive'),
      'Policy Count': client.policyCount,
      'Total Premium': client.premiumTotal,
      'Claims Count': client.claimsCount,
      'Last Policy Date': client.lastPolicyDate ? formatDate(client.lastPolicyDate) : '',
    }));
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
    
    // Generate & download Excel file
    XLSX.writeFile(workbook, `clients_report_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };
  
  // Define columns for the data table
  const columns = [
    {
      header: t("name"),
      accessorKey: "name",
      cell: (row) => (
        <div>
          <div className="font-medium">{row.name}</div>
          {row.contact_person && <div className="text-sm text-muted-foreground">{row.contact_person}</div>}
        </div>
      ),
      sortable: true,
    },
    {
      header: t("contact"),
      cell: (row) => (
        <div>
          {row.email && <div className="text-sm">{row.email}</div>}
          {row.phone && <div className="text-sm">{row.phone}</div>}
        </div>
      ),
    },
    {
      header: t("location"),
      cell: (row) => (
        <div>
          {row.city && <div className="text-sm">{row.city}</div>}
          {row.country && <div className="text-sm text-muted-foreground">{row.country}</div>}
        </div>
      ),
    },
    {
      header: t("status"),
      accessorKey: "is_active",
      cell: (row) => (
        <Badge variant={row.is_active ? "success" : "secondary"}>
          {row.is_active ? t("active") : t("inactive")}
        </Badge>
      ),
      sortable: true,
    },
    {
      header: t("policyCount"),
      accessorKey: "policyCount",
      cell: (row) => row.policyCount,
      sortable: true,
    },
    {
      header: t("premiumTotal"),
      accessorKey: "premiumTotal",
      cell: (row) => formatCurrency(row.premiumTotal),
      sortable: true,
    },
    {
      header: t("claimsCount"),
      accessorKey: "claimsCount",
      cell: (row) => row.claimsCount,
      sortable: true,
    },
    {
      header: t("lastPolicyDate"),
      accessorKey: "lastPolicyDate",
      cell: (row) => row.lastPolicyDate ? formatDate(row.lastPolicyDate) : '-',
      sortable: true,
    }
  ];

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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{t("clientsReport")}</h1>
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            {t("export")}
          </Button>
        </div>
        <p className="text-muted-foreground">
          {t("clientsReportDescription")}
        </p>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t("filters")}</CardTitle>
          <CardDescription>{t("filterClientReport")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{t("dateRange")}</label>
              <DatePickerWithRange 
                dateRange={filters.dateRange} 
                onDateRangeChange={handleDateRangeChange} 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">{t("status")}</label>
              <Select value={filters.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allClients")}</SelectItem>
                  <SelectItem value="active">{t("activeOnly")}</SelectItem>
                  <SelectItem value="inactive">{t("inactiveOnly")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">{t("search")}</label>
              <SearchInput
                value={filters.searchTerm}
                onChange={handleSearchChange}
                placeholder={t("searchClients")}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* View Selector */}
      <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="summary">{t("summary")}</TabsTrigger>
          <TabsTrigger value="details">{t("details")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="pt-4">
          <ClientReportSummary summary={summary} />
          
          {/* Simple summary table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("topClientsTable")}</CardTitle>
              <CardDescription>{t("topClientsByPolicyCount")}</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable 
                data={clientsData
                  .sort((a, b) => b.policyCount - a.policyCount)
                  .slice(0, 5)
                } 
                columns={columns}
                isLoading={isLoading}
                emptyState={{
                  title: t("noClientsFound"),
                  description: t("noClientsFoundDescription"),
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details" className="pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("clientsList")}</CardTitle>
              <CardDescription>{t("clientsListDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable 
                data={clientsData} 
                columns={columns}
                isLoading={isLoading}
                emptyState={{
                  title: t("noClientsFound"),
                  description: t("noClientsFoundDescription"),
                }}
                pagination={{
                  currentPage: 0,
                  totalPages: 1,
                  itemsPerPage: 10,
                  totalItems: clientsData.length,
                  onPageChange: () => {},
                  onPageSizeChange: () => {},
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientsReport;
