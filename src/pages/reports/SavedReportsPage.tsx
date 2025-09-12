import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  PlusCircle, 
  Edit, 
  Trash, 
  Search, 
  BarChart3, 
  Eye, 
  Copy,
  Share,
  Download,
  Play,
  MoreHorizontal,
  Globe,
  Lock,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { useSavedReports, useReportExecution } from "@/hooks/useSavedReports";
import { SavedReportWithDetails, REPORT_TYPES } from "@/types/reports";
import ReportBuilder from "@/components/reports/builder/ReportBuilder";
import ReportExecutionDialog from "@/components/reports/ReportExecutionDialog";

const SavedReportsPage = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [builderDialog, setBuilderDialog] = useState(false);
  const [executionDialog, setExecutionDialog] = useState(false);
  const [editingReport, setEditingReport] = useState<SavedReportWithDetails | null>(null);
  const [executingReport, setExecutingReport] = useState<SavedReportWithDetails | null>(null);

  const {
    reports,
    isLoading,
    createReport,
    updateReport,
    deleteReport,
    duplicateReport,
    isCreating,
    isUpdating,
    isDeleting,
    isDuplicating
  } = useSavedReports({
    search: searchTerm || undefined,
    report_type: typeFilter !== "all" ? typeFilter : undefined,
    is_public: visibilityFilter === "public" ? true : visibilityFilter === "private" ? false : undefined
  });

  const { executeReport, isExecuting } = useReportExecution();

  const handleCreateReport = () => {
    setEditingReport(null);
    setBuilderDialog(true);
  };

  const handleEditReport = (report: SavedReportWithDetails) => {
    setEditingReport(report);
    setBuilderDialog(true);
  };

  const handleExecuteReport = (report: SavedReportWithDetails) => {
    setExecutingReport(report);
    setExecutionDialog(true);
  };

  const handleDuplicateReport = (reportId: string) => {
    duplicateReport(reportId);
  };

  const handleDeleteReport = (reportId: string) => {
    deleteReport(reportId);
  };

  const getReportTypeLabel = (typeId: string) => {
    const type = REPORT_TYPES.find(t => t.id === typeId);
    return type ? type.name : typeId;
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = !searchTerm || 
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.description && report.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === "all" || report.report_type === typeFilter;
    
    const matchesVisibility = visibilityFilter === "all" || 
      (visibilityFilter === "public" && report.is_public) ||
      (visibilityFilter === "private" && !report.is_public);
    
    return matchesSearch && matchesType && matchesVisibility;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("savedReports")}</h1>
          <p className="text-muted-foreground">
            {t("savedReportsDescription")}
          </p>
        </div>
        <Button onClick={handleCreateReport} disabled={isCreating}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("createReport")}
        </Button>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t("reportLibrary")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("searchReports")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder={t("filterByType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allTypes")}</SelectItem>
                {REPORT_TYPES.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder={t("filterByVisibility")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allReports")}</SelectItem>
                <SelectItem value="public">{t("publicReports")}</SelectItem>
                <SelectItem value="private">{t("privateReports")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reports Table */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">{t("noReportsFound")}</h3>
              <p className="text-muted-foreground mb-4">{t("noReportsDescription")}</p>
              <Button onClick={handleCreateReport}>
                <PlusCircle className="mr-2 h-4 w-4" />
                {t("createFirstReport")}
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{t("type")}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("visibility")}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t("createdAt")}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t("lastModified")}</TableHead>
                    <TableHead className="w-[120px]">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{report.name}</div>
                          {report.description && (
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {report.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getReportTypeLabel(report.report_type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          {report.is_public ? (
                            <>
                              <Globe className="h-3 w-3 text-green-600" />
                              <span className="text-sm text-green-600">{t("public")}</span>
                            </>
                          ) : (
                            <>
                              <Lock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{t("private")}</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(report.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(report.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleExecuteReport(report)}>
                              <Play className="mr-2 h-4 w-4" />
                              {t("runReport")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditReport(report)}>
                              <Edit className="mr-2 h-4 w-4" />
                              {t("editReport")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateReport(report.id)}>
                              <Copy className="mr-2 h-4 w-4" />
                              {t("duplicateReport")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteReport(report.id)}
                              className="text-destructive"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              {t("deleteReport")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Builder Dialog */}
      <Dialog open={builderDialog} onOpenChange={setBuilderDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {editingReport ? t("editReport") : t("createReport")}
            </DialogTitle>
            <DialogDescription>
              {editingReport 
                ? t("editReportDescription") 
                : t("createReportDescription")
              }
            </DialogDescription>
          </DialogHeader>
          
          <ReportBuilder
            report={editingReport}
            onSave={(reportData) => {
              if (editingReport) {
                updateReport({ id: editingReport.id, updates: reportData });
              } else {
                createReport(reportData);
              }
              setBuilderDialog(false);
            }}
            onCancel={() => setBuilderDialog(false)}
            isLoading={isCreating || isUpdating}
          />
        </DialogContent>
      </Dialog>

      {/* Report Execution Dialog */}
      <Dialog open={executionDialog} onOpenChange={setExecutionDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              {t("runReport")}
            </DialogTitle>
            <DialogDescription>
              {executingReport?.name} - {getReportTypeLabel(executingReport?.report_type || "")}
            </DialogDescription>
          </DialogHeader>
          
          {executingReport && (
            <ReportExecutionDialog
              report={executingReport}
              onClose={() => setExecutionDialog(false)}
              isExecuting={isExecuting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavedReportsPage;