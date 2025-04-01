
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar, Clock, FileText } from "lucide-react";

interface Authorization {
  id: string;
  clientName: string;
  salesProcessId: string;
  fileName: string;
  uploadedBy: string;
  uploadedAt: string;
  status: string;
  expiresAt: string;
  rejectionReason?: string;
}

interface AuthorizationViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  authorization: Authorization | undefined;
}

const AuthorizationViewDialog: React.FC<AuthorizationViewDialogProps> = ({
  open,
  onOpenChange,
  authorization
}) => {
  const { t, formatDateTime, formatDate } = useLanguage();
  
  if (!authorization) {
    return null;
  }
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "pending":
        return <Badge variant="outline">{t("pending")}</Badge>;
      case "approved":
        return <Badge variant="success">{t("approved")}</Badge>;
      case "rejected":
        return <Badge variant="destructive">{t("rejected")}</Badge>;
      case "expired":
        return <Badge variant="secondary">{t("expired")}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{t("authorizationDetails")}</DialogTitle>
          <DialogDescription>
            {t("authorizationDetailsFor", { client: authorization.clientName })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center p-6 border rounded-md">
            <div className="flex flex-col items-center space-y-4">
              <FileText className="h-16 w-16 text-primary" />
              <div className="text-center">
                <p className="font-medium">{authorization.fileName}</p>
                <p className="text-sm text-muted-foreground">
                  {t("uploadedOn", { date: formatDateTime(authorization.uploadedAt) })}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-1">{t("client")}</p>
              <p>{authorization.clientName}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">{t("salesProcess")}</p>
              <p>{authorization.salesProcessId}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">{t("uploadedBy")}</p>
              <p>{authorization.uploadedBy}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">{t("uploadedAt")}</p>
              <p className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {formatDateTime(authorization.uploadedAt)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">{t("status")}</p>
              <p>{getStatusBadge(authorization.status)}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">{t("expiresAt")}</p>
              <p className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(authorization.expiresAt)}
              </p>
            </div>
          </div>
          
          {authorization.status === "rejected" && authorization.rejectionReason && (
            <div className="border-t pt-4 mt-2">
              <p className="text-sm font-medium mb-1">{t("rejectionReason")}</p>
              <p className="text-sm">{authorization.rejectionReason}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("close")}
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            {t("downloadAuthorization")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthorizationViewDialog;
