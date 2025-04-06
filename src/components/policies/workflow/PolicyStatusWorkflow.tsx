
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Loader2
} from 'lucide-react';
import PolicyService from '@/services/PolicyService';

// Define workflow status constants
const WORKFLOW_STATUS = {
  PENDING: 'pending',
  IN_REVIEW: 'in_review',
  NEEDS_INFO: 'needs_info',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export interface PolicyStatusWorkflowProps {
  policyId: string;
  currentStatus: string;
  onStatusChange?: (newStatus: string) => void;
}

export function PolicyStatusWorkflow({
  policyId,
  currentStatus,
  onStatusChange
}: PolicyStatusWorkflowProps) {
  const { t } = useLanguage();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === currentStatus) return;
    
    setIsSubmitting(true);
    try {
      await PolicyService.updatePolicy(policyId, { workflow_status: newStatus });
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
      setDialogOpen(false);
    } catch (error) {
      console.error('Error updating policy status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    // Make sure the badge variant matches the available options
    let variant: "default" | "destructive" | "secondary" | "success" | "warning" | "outline" = "default";
    let icon = null;

    switch (status) {
      case WORKFLOW_STATUS.PENDING:
        variant = "warning";
        icon = <Clock className="h-4 w-4 mr-1" />;
        break;
      case WORKFLOW_STATUS.APPROVED:
        variant = "success";
        icon = <CheckCircle className="h-4 w-4 mr-1" />;
        break;
      case WORKFLOW_STATUS.REJECTED:
        variant = "destructive";
        icon = <XCircle className="h-4 w-4 mr-1" />;
        break;
      case WORKFLOW_STATUS.IN_REVIEW:
        variant = "secondary";
        icon = <AlertCircle className="h-4 w-4 mr-1" />;
        break;
      case WORKFLOW_STATUS.NEEDS_INFO:
        variant = "outline";
        icon = <AlertTriangle className="h-4 w-4 mr-1" />;
        break;
      default:
        variant = "default";
        break;
    }

    return (
      <Badge variant={variant} className="flex items-center text-xs">
        {icon}
        {t(status)}
      </Badge>
    );
  };

  const handleOpenDialog = (status: string) => {
    setNewStatus(status);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center mb-2">
        <span className="font-medium mr-2">{t('currentStatus')}:</span>
        {getStatusBadge(currentStatus)}
      </div>

      <div className="flex flex-wrap gap-2">
        {currentStatus !== WORKFLOW_STATUS.PENDING && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleOpenDialog(WORKFLOW_STATUS.PENDING)}
          >
            {t('markAsPending')}
          </Button>
        )}

        {currentStatus !== WORKFLOW_STATUS.IN_REVIEW && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleOpenDialog(WORKFLOW_STATUS.IN_REVIEW)}
          >
            {t('markAsInReview')}
          </Button>
        )}

        {currentStatus !== WORKFLOW_STATUS.NEEDS_INFO && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleOpenDialog(WORKFLOW_STATUS.NEEDS_INFO)}
          >
            {t('markAsNeedsInfo')}
          </Button>
        )}

        {currentStatus !== WORKFLOW_STATUS.APPROVED && (
          <Button
            size="sm"
            variant="default"
            onClick={() => handleOpenDialog(WORKFLOW_STATUS.APPROVED)}
          >
            {t('approve')}
          </Button>
        )}

        {currentStatus !== WORKFLOW_STATUS.REJECTED && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleOpenDialog(WORKFLOW_STATUS.REJECTED)}
          >
            {t('reject')}
          </Button>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('updatePolicyStatus')}</DialogTitle>
            <DialogDescription>
              {t('areYouSureYouWantToUpdateStatus')}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{t('from')}:</span>
                {getStatusBadge(currentStatus)}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{t('to')}:</span>
                {getStatusBadge(newStatus)}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isSubmitting}
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('updating')}
                </>
              ) : (
                t('confirm')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
