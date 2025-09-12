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
} from "@/components/ui/dialog";
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
  Calendar,
  Play,
  Pause,
  MoreHorizontal,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail
} from "lucide-react";
import { toast } from "sonner";
import { useReportSchedules, getFrequencyDescription } from "@/hooks/useReportSchedules";
import { ReportSchedule } from "@/types/reports";
import ReportScheduleEditor from "@/components/reports/ReportScheduleEditor";

const ReportSchedulesPage = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [frequencyFilter, setFrequencyFilter] = useState("all");
  const [editorDialog, setEditorDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ReportSchedule | null>(null);

  const {
    schedules,
    isLoading,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    toggleScheduleStatus,
    runScheduleNow,
    isCreating,
    isUpdating,
    isDeleting,
    isToggling,
    isRunning
  } = useReportSchedules({
    search: searchTerm || undefined,
    status: statusFilter !== "all" ? statusFilter as any : undefined,
    frequency: frequencyFilter !== "all" ? frequencyFilter : undefined
  });

  const handleCreateSchedule = () => {
    setEditingSchedule(null);
    setEditorDialog(true);
  };

  const handleEditSchedule = (schedule: ReportSchedule) => {
    setEditingSchedule(schedule);
    setEditorDialog(true);
  };

  const handleToggleStatus = (scheduleId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    toggleScheduleStatus({ id: scheduleId, status: newStatus as any });
  };

  const handleRunNow = (scheduleId: string) => {
    runScheduleNow(scheduleId);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    deleteSchedule(scheduleId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">{t("active")}</Badge>;
      case 'paused':
        return <Badge variant="secondary">{t("paused")}</Badge>;
      case 'disabled':
        return <Badge variant="destructive">{t("disabled")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLastRunBadge = (status?: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = !searchTerm || 
      schedule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (schedule as any).saved_reports?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || schedule.status === statusFilter;
    const matchesFrequency = frequencyFilter === "all" || schedule.frequency === frequencyFilter;
    
    return matchesSearch && matchesStatus && matchesFrequency;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("reportSchedules")}</h1>
          <p className="text-muted-foreground">
            {t("reportSchedulesDescription")}
          </p>
        </div>
        <Button onClick={handleCreateSchedule} disabled={isCreating}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("createSchedule")}
        </Button>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t("scheduleManagement")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("searchSchedules")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder={t("filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses")}</SelectItem>
                <SelectItem value="active">{t("active")}</SelectItem>
                <SelectItem value="paused">{t("paused")}</SelectItem>
                <SelectItem value="disabled">{t("disabled")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={frequencyFilter} onValueChange={setFrequencyFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder={t("filterByFrequency")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allFrequencies")}</SelectItem>
                <SelectItem value="daily">{t("daily")}</SelectItem>
                <SelectItem value="weekly">{t("weekly")}</SelectItem>
                <SelectItem value="monthly">{t("monthly")}</SelectItem>
                <SelectItem value="quarterly">{t("quarterly")}</SelectItem>
                <SelectItem value="yearly">{t("yearly")}</SelectItem>
                <SelectItem value="custom">{t("custom")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Schedules Table */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">{t("noSchedulesFound")}</h3>
              <p className="text-muted-foreground mb-4">{t("noSchedulesDescription")}</p>
              <Button onClick={handleCreateSchedule}>
                <PlusCircle className="mr-2 h-4 w-4" />
                {t("createFirstSchedule")}
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{t("report")}</TableHead>
                    <TableHead>{t("frequency")}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("status")}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t("nextRun")}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t("lastRun")}</TableHead>
                    <TableHead className="w-[120px]">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{schedule.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {schedule.email_recipients.length} {t("recipients")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">
                            {(schedule as any).saved_reports?.name || t("unknownReport")}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {(schedule as any).saved_reports?.report_type || "unknown"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium capitalize">{schedule.frequency}</div>
                          <div className="text-xs text-muted-foreground">
                            {getFrequencyDescription(schedule.frequency, schedule.cron_expression)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getStatusBadge(schedule.status)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm">
                          {new Date(schedule.next_run_date).toLocaleDateString()}
                          <div className="text-xs text-muted-foreground">
                            {new Date(schedule.next_run_date).toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          {getLastRunBadge(schedule.last_run_status)}
                          <div className="text-sm">
                            {schedule.last_run_date ? (
                              <div>
                                {new Date(schedule.last_run_date).toLocaleDateString()}
                                <div className="text-xs text-muted-foreground">
                                  {schedule.last_run_status || t("unknown")}
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">{t("neverRun")}</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleRunNow(schedule.id)}>
                              <Play className="mr-2 h-4 w-4" />
                              {t("runNow")}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleToggleStatus(schedule.id, schedule.status)}
                            >
                              {schedule.status === 'active' ? (
                                <>
                                  <Pause className="mr-2 h-4 w-4" />
                                  {t("pauseSchedule")}
                                </>
                              ) : (
                                <>
                                  <Play className="mr-2 h-4 w-4" />
                                  {t("activateSchedule")}
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditSchedule(schedule)}>
                              <Edit className="mr-2 h-4 w-4" />
                              {t("editSchedule")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              className="text-destructive"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              {t("deleteSchedule")}
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

      {/* Schedule Editor Dialog */}
      <Dialog open={editorDialog} onOpenChange={setEditorDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? t("editSchedule") : t("createSchedule")}
            </DialogTitle>
            <DialogDescription>
              {editingSchedule 
                ? t("editScheduleDescription") 
                : t("createScheduleDescription")
              }
            </DialogDescription>
          </DialogHeader>
          
          <ReportScheduleEditor
            schedule={editingSchedule}
            onSave={(scheduleData) => {
              if (editingSchedule) {
                updateSchedule({ id: editingSchedule.id, updates: scheduleData });
              } else {
                createSchedule(scheduleData);
              }
              setEditorDialog(false);
            }}
            onCancel={() => setEditorDialog(false)}
            isLoading={isCreating || isUpdating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportSchedulesPage;