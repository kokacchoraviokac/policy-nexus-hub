import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Save, 
  X, 
  Plus,
  Trash,
  Calendar,
  Mail,
  Clock,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { ReportSchedule } from "@/types/reports";
import { useSavedReports } from "@/hooks/useSavedReports";
import { getFrequencyDescription, validateCronExpression } from "@/hooks/useReportSchedules";

interface ReportScheduleEditorProps {
  schedule?: ReportSchedule | null;
  onSave: (scheduleData: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ReportScheduleEditor: React.FC<ReportScheduleEditorProps> = ({
  schedule,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const { t } = useLanguage();
  const { reports } = useSavedReports();
  
  const [formData, setFormData] = useState<{
    name: string;
    report_id: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
    cron_expression: string;
    format: 'csv' | 'excel' | 'pdf';
    status: 'active' | 'paused' | 'disabled';
  }>({
    name: "",
    report_id: "",
    frequency: "weekly",
    cron_expression: "",
    format: "excel",
    status: "active"
  });
  const [emailRecipients, setEmailRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Initialize form data
  useEffect(() => {
    if (schedule) {
      setFormData({
        name: schedule.name,
        report_id: schedule.report_id,
        frequency: schedule.frequency,
        cron_expression: schedule.cron_expression || "",
        format: schedule.format,
        status: schedule.status
      });
      setEmailRecipients(schedule.email_recipients);
    } else {
      setFormData({
        name: "",
        report_id: "",
        frequency: "weekly",
        cron_expression: "",
        format: "excel",
        status: "active"
      });
      setEmailRecipients([]);
    }
  }, [schedule]);

  // Validate form
  useEffect(() => {
    const errors: string[] = [];
    
    if (!formData.name.trim()) {
      errors.push(t("scheduleNameRequired"));
    }
    
    if (!formData.report_id) {
      errors.push(t("reportRequired"));
    }
    
    if (emailRecipients.length === 0) {
      errors.push(t("atLeastOneRecipientRequired"));
    }
    
    if (formData.frequency === 'custom' && !formData.cron_expression) {
      errors.push(t("cronExpressionRequired"));
    }
    
    if (formData.frequency === 'custom' && formData.cron_expression && !validateCronExpression(formData.cron_expression)) {
      errors.push(t("invalidCronExpression"));
    }
    
    setValidationErrors(errors);
  }, [formData, emailRecipients, t]);

  const handleSave = () => {
    if (validationErrors.length > 0) {
      toast.error(t("scheduleValidationErrors"));
      return;
    }

    const scheduleData = {
      ...formData,
      email_recipients: emailRecipients
    };

    onSave(scheduleData);
  };

  const addEmailRecipient = () => {
    if (!newRecipient.trim()) return;
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newRecipient)) {
      toast.error(t("invalidEmailAddress"));
      return;
    }
    
    if (emailRecipients.includes(newRecipient)) {
      toast.error(t("emailAlreadyAdded"));
      return;
    }
    
    setEmailRecipients(prev => [...prev, newRecipient]);
    setNewRecipient("");
  };

  const removeEmailRecipient = (email: string) => {
    setEmailRecipients(prev => prev.filter(recipient => recipient !== email));
  };

  const frequencyOptions = [
    { value: 'daily', label: t("daily"), description: t("dailyDescription") },
    { value: 'weekly', label: t("weekly"), description: t("weeklyDescription") },
    { value: 'monthly', label: t("monthly"), description: t("monthlyDescription") },
    { value: 'quarterly', label: t("quarterly"), description: t("quarterlyDescription") },
    { value: 'yearly', label: t("yearly"), description: t("yearlyDescription") },
    { value: 'custom', label: t("custom"), description: t("customDescription") }
  ];

  const formatOptions = [
    { value: 'excel', label: 'Excel (.xlsx)' },
    { value: 'csv', label: 'CSV (.csv)' },
    { value: 'pdf', label: 'PDF (.pdf)' }
  ];

  const selectedReport = reports.find(r => r.id === formData.report_id);

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="schedule-name">{t("scheduleName")} *</Label>
          <Input
            id="schedule-name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder={t("enterScheduleName")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="report-select">{t("report")} *</Label>
          <Select 
            value={formData.report_id} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, report_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectReport")} />
            </SelectTrigger>
            <SelectContent>
              {reports.map(report => (
                <SelectItem key={report.id} value={report.id}>
                  <div className="flex items-center gap-2">
                    <span>{report.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {report.report_type}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Schedule Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t("scheduleConfiguration")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frequency">{t("frequency")} *</Label>
              <Select 
                value={formData.frequency} 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, frequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {getFrequencyDescription(formData.frequency, formData.cron_expression)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">{t("outputFormat")} *</Label>
              <Select 
                value={formData.format} 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, format: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formatOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Custom Cron Expression */}
          {formData.frequency === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="cron-expression">{t("cronExpression")} *</Label>
              <Input
                id="cron-expression"
                value={formData.cron_expression}
                onChange={(e) => setFormData(prev => ({ ...prev, cron_expression: e.target.value }))}
                placeholder="0 0 * * *"
              />
              <div className="text-xs text-muted-foreground">
                <p>{t("cronExpressionHelp")}</p>
                <p>{t("cronExampleDaily")}: 0 0 * * *</p>
                <p>{t("cronExampleWeekly")}: 0 0 * * 1</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Recipients */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {t("emailRecipients")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newRecipient}
              onChange={(e) => setNewRecipient(e.target.value)}
              placeholder={t("enterEmailAddress")}
              onKeyPress={(e) => e.key === 'Enter' && addEmailRecipient()}
            />
            <Button onClick={addEmailRecipient} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {emailRecipients.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm">{t("recipients")} ({emailRecipients.length})</Label>
              <div className="flex flex-wrap gap-2">
                {emailRecipients.map((email, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {email}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeEmailRecipient(email)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Report Info */}
      {selectedReport && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("selectedReport")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">{t("reportName")}:</span>
                <p className="text-muted-foreground">{selectedReport.name}</p>
              </div>
              <div>
                <span className="font-medium">{t("reportType")}:</span>
                <p className="text-muted-foreground">{selectedReport.report_type}</p>
              </div>
              <div>
                <span className="font-medium">{t("columns")}:</span>
                <p className="text-muted-foreground">{selectedReport.columns.length} {t("selected")}</p>
              </div>
              <div>
                <span className="font-medium">{t("visibility")}:</span>
                <Badge variant={selectedReport.is_public ? "default" : "secondary"}>
                  {selectedReport.is_public ? t("public") : t("private")}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
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
          {isLoading ? t("saving") : (schedule ? t("updateSchedule") : t("createSchedule"))}
        </Button>
      </div>
    </div>
  );
};

export default ReportScheduleEditor;