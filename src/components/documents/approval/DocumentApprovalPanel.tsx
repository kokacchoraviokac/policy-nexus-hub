import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  MessageSquare,
  ArrowUp,
  FileText,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import {
  DocumentApproval,
  ApprovalAction,
  getApprovalStatusColor,
  getPriorityColor,
  calculateApprovalProgress,
  isApprovalOverdue,
  getApprovalTimeRemaining
} from "@/types/document-approval";
import { useDocumentApproval } from "@/hooks/useDocumentApproval";

interface DocumentApprovalPanelProps {
  documentId: string;
  showActions?: boolean;
  compact?: boolean;
}

const DocumentApprovalPanel: React.FC<DocumentApprovalPanelProps> = ({
  documentId,
  showActions = true,
  compact = false
}) => {
  const { t } = useLanguage();
  const [actionDialog, setActionDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ApprovalAction | null>(null);
  const [actionComments, setActionComments] = useState("");
  const [assignDialog, setAssignDialog] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState("");

  const {
    approvals,
    performApprovalAction,
    assignReviewer,
    useApprovalHistory,
    isPerformingAction,
    isAssigning
  } = useDocumentApproval();

  const { data: approvalHistory = [] } = useApprovalHistory(documentId);
  
  // Find approval for this document
  const documentApproval = approvals.find(approval => approval.document_id === documentId);

  if (!documentApproval) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-6">
          <FileText className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            {t("noApprovalRequired")}
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleApprovalAction = (action: ApprovalAction) => {
    setSelectedAction(action);
    setActionDialog(true);
  };

  const confirmApprovalAction = () => {
    if (!selectedAction) return;

    performApprovalAction({
      approval_id: documentApproval.id,
      action: selectedAction,
      comments: actionComments
    });

    setActionDialog(false);
    setSelectedAction(null);
    setActionComments("");
  };

  const handleAssignReviewer = () => {
    if (!selectedReviewer) return;

    assignReviewer({
      approvalId: documentApproval.id,
      reviewerId: selectedReviewer
    });

    setAssignDialog(false);
    setSelectedReviewer("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'under_review':
        return <Eye className="h-4 w-4 text-blue-600" />;
      case 'needs_review':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionButtons = () => {
    if (documentApproval.status === 'approved' || documentApproval.status === 'rejected') {
      return null;
    }

    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => handleApprovalAction('approve')}
          disabled={isPerformingAction}
          className="bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="mr-1 h-3 w-3" />
          {t("approve")}
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleApprovalAction('request_changes')}
          disabled={isPerformingAction}
        >
          <MessageSquare className="mr-1 h-3 w-3" />
          {t("requestChanges")}
        </Button>
        
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleApprovalAction('reject')}
          disabled={isPerformingAction}
        >
          <XCircle className="mr-1 h-3 w-3" />
          {t("reject")}
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleApprovalAction('escalate')}
          disabled={isPerformingAction}
        >
          <ArrowUp className="mr-1 h-3 w-3" />
          {t("escalate")}
        </Button>
      </div>
    );
  };

  const progress = calculateApprovalProgress(documentApproval);
  const isOverdue = isApprovalOverdue(documentApproval);
  const timeRemaining = getApprovalTimeRemaining(documentApproval);

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <div className="flex items-center gap-3">
          {getStatusIcon(documentApproval.status)}
          <div>
            <div className="flex items-center gap-2">
              <Badge className={getApprovalStatusColor(documentApproval.status)}>
                {t(documentApproval.status)}
              </Badge>
              <Badge className={getPriorityColor(documentApproval.priority)}>
                {t(documentApproval.priority)}
              </Badge>
            </div>
            {timeRemaining && (
              <p className={`text-xs ${isOverdue ? 'text-red-600' : 'text-muted-foreground'}`}>
                {timeRemaining}
              </p>
            )}
          </div>
        </div>
        
        {showActions && documentApproval.status === 'pending' && (
          <div className="flex gap-1">
            <Button size="sm" onClick={() => handleApprovalAction('approve')}>
              <CheckCircle className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleApprovalAction('reject')}>
              <XCircle className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              {getStatusIcon(documentApproval.status)}
              {t("documentApproval")}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={getApprovalStatusColor(documentApproval.status)}>
                {t(documentApproval.status)}
              </Badge>
              <Badge className={getPriorityColor(documentApproval.priority)}>
                {t(documentApproval.priority)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Approval Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{t("approvalProgress")}</span>
                <span className="text-sm text-muted-foreground">
                  {documentApproval.current_approvals}/{documentApproval.required_approvals}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Approval Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">{t("approvalLevel")}:</span>
                <p className="text-muted-foreground capitalize">{documentApproval.approval_level}</p>
              </div>
              <div>
                <span className="font-medium">{t("assignedReviewer")}:</span>
                <p className="text-muted-foreground">
                  {documentApproval.reviewer_name || t("unassigned")}
                </p>
              </div>
              {documentApproval.due_date && (
                <div>
                  <span className="font-medium">{t("dueDate")}:</span>
                  <p className={`${isOverdue ? 'text-red-600' : 'text-muted-foreground'}`}>
                    {new Date(documentApproval.due_date).toLocaleDateString()}
                  </p>
                </div>
              )}
              {timeRemaining && (
                <div>
                  <span className="font-medium">{t("timeRemaining")}:</span>
                  <p className={`${isOverdue ? 'text-red-600' : 'text-muted-foreground'}`}>
                    {timeRemaining}
                  </p>
                </div>
              )}
            </div>

            {/* Comments */}
            {documentApproval.comments && (
              <div>
                <span className="text-sm font-medium">{t("comments")}:</span>
                <p className="text-sm text-muted-foreground mt-1">
                  {documentApproval.comments}
                </p>
              </div>
            )}

            {/* Actions */}
            {showActions && (
              <div className="flex flex-col gap-3">
                {!documentApproval.reviewer_id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAssignDialog(true)}
                    disabled={isAssigning}
                  >
                    <User className="mr-2 h-4 w-4" />
                    {t("assignReviewer")}
                  </Button>
                )}
                
                {getActionButtons()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Approval History */}
      {approvalHistory.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("approvalHistory")}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-[200px]">
              <div className="space-y-3">
                {approvalHistory.map((history, index) => (
                  <div key={history.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    {getStatusIcon(history.new_status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{history.reviewer_name}</span>
                        <Badge variant="outline" className="text-xs">
                          {t(history.action)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(history.created_at).toLocaleString()}
                      </p>
                      {history.comments && (
                        <p className="text-sm mt-2">{history.comments}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Action Dialog */}
      <Dialog open={actionDialog} onOpenChange={setActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAction === 'approve' && t("approveDocument")}
              {selectedAction === 'reject' && t("rejectDocument")}
              {selectedAction === 'request_changes' && t("requestChanges")}
              {selectedAction === 'escalate' && t("escalateApproval")}
            </DialogTitle>
            <DialogDescription>
              {t("approvalActionDescription")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="comments">{t("comments")}</Label>
              <Textarea
                id="comments"
                value={actionComments}
                onChange={(e) => setActionComments(e.target.value)}
                placeholder={t("enterApprovalComments")}
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(false)}>
              {t("cancel")}
            </Button>
            <Button 
              onClick={confirmApprovalAction}
              disabled={isPerformingAction}
              variant={selectedAction === 'approve' ? 'default' : selectedAction === 'reject' ? 'destructive' : 'outline'}
            >
              {isPerformingAction ? t("processing") : t("confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Reviewer Dialog */}
      <Dialog open={assignDialog} onOpenChange={setAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("assignReviewer")}</DialogTitle>
            <DialogDescription>
              {t("selectReviewerForDocument")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="reviewer">{t("reviewer")}</Label>
              <Select value={selectedReviewer} onValueChange={setSelectedReviewer}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectReviewer")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reviewer-1">John Reviewer (Admin)</SelectItem>
                  <SelectItem value="reviewer-2">Jane Smith (Manager)</SelectItem>
                  <SelectItem value="reviewer-3">Bob Johnson (Legal)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialog(false)}>
              {t("cancel")}
            </Button>
            <Button 
              onClick={handleAssignReviewer}
              disabled={isAssigning || !selectedReviewer}
            >
              {isAssigning ? t("assigning") : t("assign")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentApprovalPanel;