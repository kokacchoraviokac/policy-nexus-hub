import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Settings, 
  Eye, 
  Save, 
  X, 
  Plus,
  Trash,
  GripVertical,
  Filter,
  Columns,
  SortAsc,
  SortDesc
} from "lucide-react";
import { toast } from "sonner";
import {
  SavedReportWithDetails,
  CreateSavedReportRequest,
  UpdateSavedReportRequest,
  ReportColumn,
  ReportSorting,
  ReportFilters,
  REPORT_TYPES,
  getReportTypeById,
  getDefaultColumns,
  validateReportDefinition
} from "@/types/reports";

interface ReportBuilderProps {
  report?: SavedReportWithDetails | null;
  onSave: (reportData: CreateSavedReportRequest | UpdateSavedReportRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ReportBuilder: React.FC<ReportBuilderProps> = ({
  report,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    report_type: "",
    is_public: false
  });
  const [selectedColumns, setSelectedColumns] = useState<ReportColumn[]>([]);
  const [reportFilters, setReportFilters] = useState<ReportFilters>({});
  const [sorting, setSorting] = useState<ReportSorting[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Initialize form data
  useEffect(() => {
    if (report) {
      setFormData({
        name: report.name,
        description: report.description || "",
        report_type: report.report_type,
        is_public: report.is_public
      });
      setSelectedColumns(report.columns);
      setReportFilters(report.filters);
      setSorting(report.sorting);
    } else {
      setFormData({
        name: "",
        description: "",
        report_type: "",
        is_public: false
      });
      setSelectedColumns([]);
      setReportFilters({});
      setSorting([]);
    }
  }, [report]);

  // Update columns when report type changes
  useEffect(() => {
    if (formData.report_type && !report) {
      const defaultColumns = getDefaultColumns(formData.report_type);
      setSelectedColumns(defaultColumns);
    }
  }, [formData.report_type, report]);

  // Validate report definition
  useEffect(() => {
    if (formData.name && formData.report_type && selectedColumns.length > 0) {
      const reportData: CreateSavedReportRequest = {
        name: formData.name,
        description: formData.description,
        report_type: formData.report_type,
        filters: reportFilters,
        columns: selectedColumns,
        sorting: sorting,
        is_public: formData.is_public
      };
      
      const errors = validateReportDefinition(reportData);
      setValidationErrors(errors);
    }
  }, [formData, selectedColumns, reportFilters, sorting]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error(t("reportNameRequired"));
      return;
    }
    
    if (!formData.report_type) {
      toast.error(t("reportTypeRequired"));
      return;
    }
    
    if (selectedColumns.length === 0) {
      toast.error(t("selectAtLeastOneColumn"));
      return;
    }

    if (validationErrors.length > 0) {
      toast.error(t("reportValidationErrors"));
      return;
    }

    const reportData = {
      name: formData.name,
      description: formData.description,
      report_type: formData.report_type,
      filters: reportFilters,
      columns: selectedColumns,
      sorting: sorting,
      is_public: formData.is_public
    };

    onSave(reportData);
  };

  const toggleColumn = (column: ReportColumn) => {
    setSelectedColumns(prev => {
      const exists = prev.find(col => col.id === column.id);
      if (exists) {
        return prev.filter(col => col.id !== column.id);
      } else {
        return [...prev, { ...column, order: prev.length + 1 }];
      }
    });
  };

  const updateColumnOrder = (columnId: string, newOrder: number) => {
    setSelectedColumns(prev => 
      prev.map(col => 
        col.id === columnId ? { ...col, order: newOrder } : col
      ).sort((a, b) => a.order - b.order)
    );
  };

  const addSorting = (columnId: string, direction: 'asc' | 'desc') => {
    setSorting(prev => {
      const existing = prev.find(sort => sort.column === columnId);
      if (existing) {
        return prev.map(sort => 
          sort.column === columnId 
            ? { ...sort, direction }
            : sort
        );
      } else {
        return [...prev, { column: columnId, direction, order: prev.length + 1 }];
      }
    });
  };

  const removeSorting = (columnId: string) => {
    setSorting(prev => prev.filter(sort => sort.column !== columnId));
  };

  const reportType = formData.report_type ? getReportTypeById(formData.report_type) : null;
  const availableColumns = reportType ? reportType.available_columns : [];

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="report-name">{t("reportName")} *</Label>
          <Input
            id="report-name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder={t("enterReportName")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="report-type">{t("reportType")} *</Label>
          <Select 
            value={formData.report_type} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, report_type: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectReportType")} />
            </SelectTrigger>
            <SelectContent>
              {REPORT_TYPES.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="report-description">{t("description")}</Label>
        <Textarea
          id="report-description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder={t("enterReportDescription")}
          className="min-h-[80px]"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is-public"
          checked={formData.is_public}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
        />
        <Label htmlFor="is-public">{t("makeReportPublic")}</Label>
      </div>

      {/* Report Configuration */}
      {formData.report_type && (
        <Tabs defaultValue="columns" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="columns" className="flex items-center gap-2">
              <Columns className="h-4 w-4" />
              {t("columns")}
            </TabsTrigger>
            <TabsTrigger value="filters" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {t("filters")}
            </TabsTrigger>
            <TabsTrigger value="sorting" className="flex items-center gap-2">
              <SortAsc className="h-4 w-4" />
              {t("sorting")}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="columns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("selectColumns")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Available Columns */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">{t("availableColumns")}</h4>
                    <ScrollArea className="h-[300px] border rounded-md p-2">
                      <div className="space-y-2">
                        {availableColumns.map((column) => {
                          const isSelected = selectedColumns.some(col => col.id === column.id);
                          return (
                            <div
                              key={column.id}
                              className={`p-2 rounded-md cursor-pointer transition-colors ${
                                isSelected 
                                  ? 'bg-primary/10 border border-primary/20' 
                                  : 'hover:bg-muted/50 border border-transparent'
                              }`}
                              onClick={() => toggleColumn(column)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium">{column.label}</p>
                                  <p className="text-xs text-muted-foreground">{column.name}</p>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {column.type}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Selected Columns */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">
                      {t("selectedColumns")} ({selectedColumns.length})
                    </h4>
                    <ScrollArea className="h-[300px] border rounded-md p-2">
                      <div className="space-y-2">
                        {selectedColumns
                          .sort((a, b) => a.order - b.order)
                          .map((column, index) => (
                            <div
                              key={column.id}
                              className="p-2 bg-muted/30 rounded-md border"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm font-medium">{column.label}</p>
                                    <p className="text-xs text-muted-foreground">#{index + 1}</p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleColumn(column)}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        {selectedColumns.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <Columns className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-sm">{t("noColumnsSelected")}</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="filters" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("configureFilters")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Filter className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">{t("filtersConfigurationComingSoon")}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sorting" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("configureSorting")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedColumns.length > 0 ? (
                    <div className="space-y-2">
                      {selectedColumns.map((column) => {
                        const currentSort = sorting.find(sort => sort.column === column.id);
                        return (
                          <div key={column.id} className="flex items-center justify-between p-2 border rounded-md">
                            <span className="text-sm font-medium">{column.label}</span>
                            <div className="flex items-center gap-2">
                              {currentSort ? (
                                <>
                                  <Badge variant="outline" className="text-xs">
                                    {currentSort.direction === 'asc' ? t("ascending") : t("descending")}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => addSorting(column.id, currentSort.direction === 'asc' ? 'desc' : 'asc')}
                                  >
                                    {currentSort.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSorting(column.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addSorting(column.id, 'asc')}
                                >
                                  <Plus className="mr-1 h-3 w-3" />
                                  {t("addSort")}
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <SortAsc className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">{t("selectColumnsFirstToConfigureSorting")}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Card className="border-destructive">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-destructive">
              {t("validationErrors")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-sm space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-destructive">• {error}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          <X className="mr-2 h-4 w-4" />
          {t("cancel")}
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={isLoading || validationErrors.length > 0}
        >
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? t("saving") : (report ? t("updateReport") : t("createReport"))}
        </Button>
      </div>
    </div>
  );
};

export default ReportBuilder;