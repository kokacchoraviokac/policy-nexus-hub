import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Play, 
  Download, 
  X, 
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  FileSpreadsheet,
  FileImage
} from "lucide-react";
import { toast } from "sonner";
import { SavedReportWithDetails } from "@/types/reports";
import { useReportExecution } from "@/hooks/useSavedReports";

interface ReportExecutionDialogProps {
  report: SavedReportWithDetails;
  onClose: () => void;
  isExecuting?: boolean;
}

const ReportExecutionDialog: React.FC<ReportExecutionDialogProps> = ({
  report,
  onClose,
  isExecuting = false
}) => {
  const { t } = useLanguage();
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'csv' | 'excel' | 'pdf'>('excel');
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  const { executeReport } = useReportExecution();

  const handleExecuteReport = async () => {
    setIsRunning(true);
    try {
      const result = await new Promise((resolve, reject) => {
        executeReport(
          {
            report_id: report.id,
            format: selectedFormat
          },
          {
            onSuccess: resolve,
            onError: reject
          }
        );
      });
      
      setExecutionResult(result);
      toast.success(t("reportExecutedSuccessfully"));
    } catch (error) {
      console.error("Report execution failed:", error);
      toast.error(t("reportExecutionFailed"));
    } finally {
      setIsRunning(false);
    }
  };

  const handleDownloadReport = () => {
    if (!executionResult) return;

    // Simulate file download
    const filename = `${report.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.${selectedFormat}`;
    
    // In a real implementation, this would download the actual file
    toast.success(t("downloadStarted"), {
      description: `${filename} ${t("downloadStarted").toLowerCase()}`
    });
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <FileImage className="h-4 w-4" />;
      case 'excel':
      case 'csv':
        return <FileSpreadsheet className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatOptions = [
    { value: 'excel', label: 'Excel (.xlsx)', icon: <FileSpreadsheet className="h-4 w-4" /> },
    { value: 'csv', label: 'CSV (.csv)', icon: <FileSpreadsheet className="h-4 w-4" /> },
    { value: 'pdf', label: 'PDF (.pdf)', icon: <FileImage className="h-4 w-4" /> },
    { value: 'json', label: 'JSON (.json)', icon: <FileText className="h-4 w-4" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Report Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{report.name}</CardTitle>
          {report.description && (
            <p className="text-sm text-muted-foreground">{report.description}</p>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">{t("reportType")}:</span>
              <p className="text-muted-foreground">{report.report_type}</p>
            </div>
            <div>
              <span className="font-medium">{t("columns")}:</span>
              <p className="text-muted-foreground">{report.columns.length} {t("selected")}</p>
            </div>
            <div>
              <span className="font-medium">{t("visibility")}:</span>
              <Badge variant={report.is_public ? "default" : "secondary"}>
                {report.is_public ? t("public") : t("private")}
              </Badge>
            </div>
            <div>
              <span className="font-medium">{t("lastModified")}:</span>
              <p className="text-muted-foreground">
                {new Date(report.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Execution Configuration */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("executionSettings")}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t("outputFormat")}</Label>
              <Select value={selectedFormat} onValueChange={(value: any) => setSelectedFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formatOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {option.icon}
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                onClick={handleExecuteReport}
                disabled={isRunning || isExecuting}
                className="flex-1"
              >
                {isRunning || isExecuting ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    {t("executing")}
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    {t("runReport")}
                  </>
                )}
              </Button>
              
              {executionResult && (
                <Button 
                  variant="outline"
                  onClick={handleDownloadReport}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t("download")}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Execution Results */}
      {executionResult && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                {t("executionResults")}
              </CardTitle>
              <Badge variant="outline">
                {executionResult.total_count} {t("records")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Execution Stats */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-muted/50 rounded-md">
                  <p className="font-medium">{executionResult.total_count}</p>
                  <p className="text-muted-foreground">{t("totalRecords")}</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-md">
                  <p className="font-medium">{Math.round(executionResult.execution_time)}ms</p>
                  <p className="text-muted-foreground">{t("executionTime")}</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-md">
                  <p className="font-medium">{selectedFormat.toUpperCase()}</p>
                  <p className="text-muted-foreground">{t("format")}</p>
                </div>
              </div>

              <Separator />

              {/* Data Preview */}
              <div>
                <h4 className="text-sm font-medium mb-3">{t("dataPreview")} ({t("first10Records")})</h4>
                <ScrollArea className="h-[300px] border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(executionResult.data[0] || {}).map(key => (
                          <TableHead key={key} className="text-xs">
                            {key}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {executionResult.data.slice(0, 10).map((row: any, index: number) => (
                        <TableRow key={index}>
                          {Object.values(row).map((value: any, cellIndex: number) => (
                            <TableCell key={cellIndex} className="text-xs">
                              {typeof value === 'number' && value % 1 !== 0 
                                ? Number(value).toFixed(2)
                                : String(value)
                              }
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Close Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          <X className="mr-2 h-4 w-4" />
          {t("close")}
        </Button>
      </div>
    </div>
  );
};

export default ReportExecutionDialog;