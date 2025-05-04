
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, Download, Search, UserRound } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAgentsReport, AgentReportFilters } from "@/hooks/useAgentsReport";
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
const AgentReportSummary = ({ summary }) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="text-sm font-medium text-muted-foreground mb-1">{t("totalAgents")}</div>
          <div className="text-2xl font-bold">{summary.totalAgents}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-sm font-medium text-muted-foreground mb-1">{t("activeAgents")}</div>
          <div className="text-2xl font-bold text-green-600">{summary.activeAgents}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-sm font-medium text-muted-foreground mb-1">{t("avgPoliciesPerAgent")}</div>
          <div className="text-2xl font-bold">{summary.averagePoliciesPerAgent.toFixed(1)}</div>
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
      <Card>
        <CardContent className="p-4">
          <div className="text-sm font-medium text-muted-foreground mb-1">{t("totalCommission")}</div>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalCommission)}</div>
        </CardContent>
      </Card>
    </div>
  );
};

const AgentsReport = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");
  const [filters, setFilters] = useState<AgentReportFilters>({
    dateRange: undefined,
    status: 'all',
    searchTerm: "",
  });
  
  const { agentsData, summary, isLoading, error } = useAgentsReport(filters);

  const handleDateRangeChange = (range: DateRange) => {
    setFilters(prev => ({ ...prev, dateRange: range }));
  };

  const handleStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, status: value }));
  };

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, searchTerm: value }));
  };

  const handleBackToReports = () => {
    navigate("/reports");
  };
  
  const handleExport = () => {
    // Prepare data for export
    const exportData = agentsData.map(agent => ({
      Name: agent.name,
      Email: agent.email || '',
      Phone: agent.phone || '',
      Status: agent.status,
      'Policy Count': agent.policyCount,
      'Client Count': agent.clientCount,
      'Total Premium': agent.premiumTotal,
      'Commission': agent.commissionTotal,
    }));
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Agents");
    
    // Generate & download Excel file
    XLSX.writeFile(workbook, `agents_report_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };
  
  // Define columns for the data table
  const columns = [
    {
      header: t("name"),
      accessorKey: "name",
      cell: (row) => (
        <div className="font-medium">{row.name}</div>
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
      header: t("status"),
      accessorKey: "status",
      cell: (row) => (
        <Badge variant={row.status === "active" ? "success" : "secondary"}>
          {row.status}
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
      header: t("clientCount"),
      accessorKey: "clientCount",
      cell: (row) => row.clientCount,
      sortable: true,
    },
    {
      header: t("premiumTotal"),
      accessorKey: "premiumTotal",
      cell: (row) => formatCurrency(row.premiumTotal),
      sortable: true,
    },
    {
      header: t("commissionTotal"),
      accessorKey: "commissionTotal",
      cell: (row) => formatCurrency(row.commissionTotal),
      sortable: true,
    },
    {
      header: t("commissionRate"),
      cell: (row) => {
        const rate = row.premiumTotal > 0 
          ? (row.commissionTotal / row.premiumTotal) * 100 
          : 0;
        return `${rate.toFixed(2)}%`;
      },
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
          <h1 className="text-2xl font-bold tracking-tight">{t("agentsReport")}</h1>
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            {t("export")}
          </Button>
        </div>
        <p className="text-muted-foreground">
          {t("agentsReportDescription")}
        </p>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t("filters")}</CardTitle>
          <CardDescription>{t("filterAgentReport")}</CardDescription>
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
                  <SelectItem value="all">{t("allAgents")}</SelectItem>
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
                placeholder={t("searchAgents")}
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
          <AgentReportSummary summary={summary} />
          
          {/* Simple summary table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("topAgentsTable")}</CardTitle>
              <CardDescription>{t("topAgentsByCommission")}</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable 
                data={agentsData
                  .sort((a, b) => b.commissionTotal - a.commissionTotal)
                  .slice(0, 5)
                } 
                columns={columns}
                isLoading={isLoading}
                emptyState={{
                  title: t("noAgentsFound"),
                  description: t("noAgentsFoundDescription"),
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details" className="pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("agentsList")}</CardTitle>
              <CardDescription>{t("agentsListDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable 
                data={agentsData} 
                columns={columns}
                isLoading={isLoading}
                emptyState={{
                  title: t("noAgentsFound"),
                  description: t("noAgentsFoundDescription"),
                }}
                pagination={{
                  currentPage: 0,
                  totalPages: 1,
                  itemsPerPage: 10,
                  totalItems: agentsData.length,
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

export default AgentsReport;
