
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, MoreHorizontal, Download, Eye, Clock } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import AuthorizationStatusDialog from "./AuthorizationStatusDialog";
import AuthorizationViewDialog from "./AuthorizationViewDialog";

// Mock data for authorizations
const mockAuthorizations = [
  { 
    id: "1",
    clientName: "Acme Corporation", 
    salesProcessId: "SP-001",
    fileName: "acme-authorization-form.pdf",
    uploadedBy: "John Doe",
    uploadedAt: "2024-01-15T10:30:00Z",
    status: "pending",
    expiresAt: "2025-01-15T00:00:00Z"
  },
  { 
    id: "2",
    clientName: "Globex Industries", 
    salesProcessId: "SP-002",
    fileName: "globex-auth-form.pdf",
    uploadedBy: "Jane Smith",
    uploadedAt: "2024-02-10T14:45:00Z",
    status: "approved",
    expiresAt: "2025-02-10T00:00:00Z"
  },
  { 
    id: "3",
    clientName: "Oceanic Airlines", 
    salesProcessId: "SP-003",
    fileName: "oceanic-authorization.pdf",
    uploadedBy: "Mike Johnson",
    uploadedAt: "2024-03-05T09:15:00Z",
    status: "expired",
    expiresAt: "2024-06-05T00:00:00Z"
  },
  { 
    id: "4",
    clientName: "Stark Industries", 
    salesProcessId: "SP-004",
    fileName: "stark-authorization-2024.pdf",
    uploadedBy: "Sarah Williams",
    uploadedAt: "2024-03-20T16:30:00Z",
    status: "rejected",
    expiresAt: "2025-03-20T00:00:00Z",
    rejectionReason: "Signature mismatch"
  },
];

interface AuthorizationsTableProps {
  searchTerm?: string;
}

const AuthorizationsTable: React.FC<AuthorizationsTableProps> = ({ searchTerm = "" }) => {
  const { t, formatDate, formatDateTime } = useLanguage();
  const [viewAuthId, setViewAuthId] = useState<string | null>(null);
  const [statusAuthId, setStatusAuthId] = useState<string | null>(null);
  
  // Filter authorizations based on search term
  const filteredAuthorizations = mockAuthorizations.filter(auth => 
    auth.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    auth.salesProcessId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    auth.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get authorization by ID
  const getAuthorizationById = (id: string) => {
    return mockAuthorizations.find(auth => auth.id === id);
  };
  
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
  
  if (filteredAuthorizations.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">{t("noAuthorizationsFound")}</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("client")}</TableHead>
              <TableHead>{t("salesProcess")}</TableHead>
              <TableHead>{t("document")}</TableHead>
              <TableHead>{t("uploadedBy")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("expiresAt")}</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAuthorizations.map((auth) => (
              <TableRow key={auth.id}>
                <TableCell className="font-medium">{auth.clientName}</TableCell>
                <TableCell>{auth.salesProcessId}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    {auth.fileName}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{auth.uploadedBy}</span>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> 
                      {formatDateTime(auth.uploadedAt)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(auth.status)}</TableCell>
                <TableCell>{formatDate(auth.expiresAt)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">{t("openMenu")}</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setViewAuthId(auth.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        {t("viewAuthorization")}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        {t("downloadAuthorization")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusAuthId(auth.id)}>
                        <FileText className="mr-2 h-4 w-4" />
                        {t("updateStatus")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {viewAuthId && (
        <AuthorizationViewDialog
          open={!!viewAuthId}
          onOpenChange={() => setViewAuthId(null)}
          authorization={getAuthorizationById(viewAuthId)}
        />
      )}
      
      {statusAuthId && (
        <AuthorizationStatusDialog
          open={!!statusAuthId}
          onOpenChange={() => setStatusAuthId(null)}
          authorizationId={statusAuthId}
          currentStatus={getAuthorizationById(statusAuthId)?.status || ""}
        />
      )}
    </>
  );
};

export default AuthorizationsTable;
