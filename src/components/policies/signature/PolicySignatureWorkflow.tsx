import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuditTrail } from "@/hooks/useAuditTrail";
import {
  Send,
  Download,
  Upload,
  CheckCircle,
  Clock,
  FileText,
  User,
  Building
} from "lucide-react";
import { Policy } from "@/types/policies";
import SendToClientDialog from "./SendToClientDialog";
import UploadSignedDialog from "./UploadSignedDialog";
import SendToInsurerDialog from "./SendToInsurerDialog";
import SignatureDocumentManager from "./SignatureDocumentManager";
import { toast } from "sonner";

interface PolicySignatureWorkflowProps {
  policy: Policy;
  onSignatureComplete?: () => void;
}

type SignatureStage = 'draft' | 'sent_to_client' | 'signed_by_client' | 'sent_to_insurer' | 'approved_by_insurer' | 'completed';

interface SignatureStatus {
  stage: SignatureStage;
  sent_to_client_at?: string;
  signed_by_client_at?: string;
  sent_to_insurer_at?: string;
  approved_by_insurer_at?: string;
  notes?: string;
}

const PolicySignatureWorkflow: React.FC<PolicySignatureWorkflowProps> = ({
  policy,
  onSignatureComplete
}) => {
  const { t } = useLanguage();
  const { logSignatureAction } = useAuditTrail();
  const [signatureStatus, setSignatureStatus] = useState<SignatureStatus>({
    stage: 'draft'
  });
  const [sendToClientDialog, setSendToClientDialog] = useState(false);
  const [uploadSignedDialog, setUploadSignedDialog] = useState(false);
  const [sendToInsurerDialog, setSendToInsurerDialog] = useState(false);

  // Mock data - in real app this would come from API
  useEffect(() => {
    // Simulate fetching signature status
    const mockStatus: SignatureStatus = {
      stage: 'sent_to_client',
      sent_to_client_at: '2024-01-20T10:00:00Z',
      notes: 'Policy sent to client for review and signature'
    };
    setSignatureStatus(mockStatus);
  }, [policy.id]);

  const getStageBadge = (stage: SignatureStage) => {
    const stageConfig = {
      draft: { variant: "secondary" as const, icon: Clock, label: t("draft") },
      sent_to_client: { variant: "default" as const, icon: Send, label: t("sentToClient") },
      signed_by_client: { variant: "outline" as const, icon: CheckCircle, label: t("signedByClient") },
      sent_to_insurer: { variant: "default" as const, icon: Send, label: t("sentToInsurer") },
      approved_by_insurer: { variant: "default" as const, icon: CheckCircle, label: t("approvedByInsurer") },
      completed: { variant: "default" as const, icon: CheckCircle, label: t("completed") }
    };

    const config = stageConfig[stage];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const handleSendToClient = () => {
    setSendToClientDialog(true);
  };

  const handleUploadSigned = () => {
    setUploadSignedDialog(true);
  };

  const handleSendToInsurer = () => {
    setSendToInsurerDialog(true);
  };

  const handleSendToClientComplete = (message: string) => {
    setSignatureStatus(prev => ({
      ...prev,
      stage: 'sent_to_client',
      sent_to_client_at: new Date().toISOString(),
      notes: message
    }));

    // Log audit trail
    logSignatureAction('sent_to_client', policy.id, policy.company_id, {
      message,
      policy_number: policy.policy_number,
      client_name: policy.policyholder_name
    });

    toast.success(t("policySentToClient"));
    setSendToClientDialog(false);
  };

  const handleUploadSignedComplete = (file: File, notes: string) => {
    setSignatureStatus(prev => ({
      ...prev,
      stage: 'signed_by_client',
      signed_by_client_at: new Date().toISOString(),
      notes: notes
    }));

    // Log audit trail
    logSignatureAction('signed_by_client', policy.id, policy.company_id, {
      file_name: file.name,
      file_size: file.size,
      notes,
      policy_number: policy.policy_number
    });

    toast.success(t("signedPolicyUploaded"));
    setUploadSignedDialog(false);
  };

  const handleSendToInsurerComplete = (message: string) => {
    setSignatureStatus(prev => ({
      ...prev,
      stage: 'sent_to_insurer',
      sent_to_insurer_at: new Date().toISOString(),
      notes: message
    }));

    // Log audit trail
    logSignatureAction('sent_to_insurer', policy.id, policy.company_id, {
      message,
      policy_number: policy.policy_number,
      insurer_name: policy.insurer_name
    });

    toast.success(t("signedPolicySentToInsurer"));
    setSendToInsurerDialog(false);

    // Simulate insurer approval after some time
    setTimeout(() => {
      setSignatureStatus(prev => ({
        ...prev,
        stage: 'approved_by_insurer',
        approved_by_insurer_at: new Date().toISOString(),
        notes: 'Policy approved by insurer'
      }));

      // Log insurer approval
      logSignatureAction('approved_by_insurer', policy.id, policy.company_id, {
        policy_number: policy.policy_number,
        insurer_name: policy.insurer_name,
        approval_notes: 'Policy approved by insurer'
      });

      toast.success(t("policyApprovedByInsurer"));
      onSignatureComplete?.();
    }, 3000);
  };

  const getAvailableActions = () => {
    switch (signatureStatus.stage) {
      case 'draft':
        return [
          {
            label: t("sendToClient"),
            icon: Send,
            onClick: handleSendToClient,
            variant: "default" as const
          }
        ];
      case 'sent_to_client':
        return [
          {
            label: t("uploadSignedPolicy"),
            icon: Upload,
            onClick: handleUploadSigned,
            variant: "outline" as const
          }
        ];
      case 'signed_by_client':
        return [
          {
            label: t("sendToInsurer"),
            icon: Send,
            onClick: handleSendToInsurer,
            variant: "default" as const
          }
        ];
      case 'sent_to_insurer':
        return [
          {
            label: t("waitingForApproval"),
            icon: Clock,
            onClick: () => {},
            variant: "secondary" as const,
            disabled: true
          }
        ];
      case 'approved_by_insurer':
      case 'completed':
        return [
          {
            label: t("downloadFinalPolicy"),
            icon: Download,
            onClick: () => toast.success(t("downloadStarted")),
            variant: "outline" as const
          }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t("signatureWorkflow")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("managePolicySignatureProcess")}
          </p>
        </div>
        {getStageBadge(signatureStatus.stage)}
      </div>

      {/* Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("signatureProgress")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ['sent_to_client', 'signed_by_client', 'sent_to_insurer', 'approved_by_insurer', 'completed'].includes(signatureStatus.stage)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}>
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{t("sendToClient")}</p>
                {signatureStatus.sent_to_client_at && (
                  <p className="text-sm text-muted-foreground">
                    {new Date(signatureStatus.sent_to_client_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ['signed_by_client', 'sent_to_insurer', 'approved_by_insurer', 'completed'].includes(signatureStatus.stage)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}>
                <CheckCircle className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{t("clientSignature")}</p>
                {signatureStatus.signed_by_client_at && (
                  <p className="text-sm text-muted-foreground">
                    {new Date(signatureStatus.signed_by_client_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ['sent_to_insurer', 'approved_by_insurer', 'completed'].includes(signatureStatus.stage)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}>
                <Building className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{t("insurerApproval")}</p>
                {signatureStatus.sent_to_insurer_at && (
                  <p className="text-sm text-muted-foreground">
                    {new Date(signatureStatus.sent_to_insurer_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Policy Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("policyInformation")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">{t("policyNumber")}:</span>
              <p className="text-muted-foreground">{policy.policy_number}</p>
            </div>
            <div>
              <span className="font-medium">{t("client")}:</span>
              <p className="text-muted-foreground">{policy.policyholder_name}</p>
            </div>
            <div>
              <span className="font-medium">{t("insurer")}:</span>
              <p className="text-muted-foreground">{policy.insurer_name}</p>
            </div>
            <div>
              <span className="font-medium">{t("premium")}:</span>
              <p className="text-muted-foreground">
                {policy.premium} {policy.currency}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {signatureStatus.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("notes")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {signatureStatus.notes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {getAvailableActions().map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant={action.variant}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              <Icon className="mr-2 h-4 w-4" />
              {action.label}
            </Button>
          );
        })}
      </div>

      {/* Document Management */}
      <SignatureDocumentManager
        policy={policy}
        signatureStage={signatureStatus.stage}
        onDocumentUploaded={(document) => {
          console.log("Document uploaded:", document);
          toast.success(t("documentUploaded"));
        }}
        onDocumentDeleted={(documentId) => {
          console.log("Document deleted:", documentId);
          toast.success(t("documentDeleted"));
        }}
      />

      {/* Dialogs */}
      <SendToClientDialog
        open={sendToClientDialog}
        onOpenChange={setSendToClientDialog}
        policy={policy}
        onSendComplete={handleSendToClientComplete}
      />

      <UploadSignedDialog
        open={uploadSignedDialog}
        onOpenChange={setUploadSignedDialog}
        policy={policy}
        onUploadComplete={handleUploadSignedComplete}
      />

      <SendToInsurerDialog
        open={sendToInsurerDialog}
        onOpenChange={setSendToInsurerDialog}
        policy={policy}
        onSendComplete={handleSendToInsurerComplete}
      />
    </div>
  );
};

export default PolicySignatureWorkflow;