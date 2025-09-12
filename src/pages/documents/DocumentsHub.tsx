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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  FileText, 
  Search, 
  Filter,
  Upload,
  Download,
  Eye,
  Edit,
  Trash,
  MoreHorizontal,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  FolderOpen,
  Archive
} from "lucide-react";
import { toast } from "sonner";
import { useDocuments } from "@/hooks/useDocuments";
import { useDocumentApproval, useApprovalStats } from "@/hooks/useDocumentApproval";
import { Document, EntityType, DocumentCategory } from "@/types/documents";
import { getApprovalStatusColor, getPriorityColor } from "@/types/document-approval";
import DocumentApprovalPanel from "@/components/documents/approval/DocumentApprovalPanel";
import DocumentUploadDialog from "@/components/documents/DocumentUploadDialog";

const DocumentsHub = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [entityFilter, setEntityFilter] = useState<EntityType | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [uploadDialog, setUploadDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Get approval statistics
  const approvalStats = useApprovalStats();

  // Mock combined documents data - in production this would be a unified query
  const [allDocuments] = useState<Document[]>([
    {
      id: 'doc-1',
      document_name: 'Policy Contract - ABC Insurance.pdf',
      document_type: 'policy',
      entity_type: 'policy',
      entity_id: 'policy-1',
      uploaded_by_id: 'user-1',
      uploaded_by_name: 'John Doe',
      category: 'policy',
      file_path: 'documents/policy/policy-1/contract.pdf',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      version: 1,
      status: 'active',
      approval_status: 'pending'
    },
    {
      id: 'doc-2',
      document_name: 'Claim Evidence - Vehicle Photos.zip',
      document_type: 'evidence',
      entity_type: 'claim',
      entity_id: 'claim-1',
      uploaded_by_id: 'user-2',
      uploaded_by_name: 'Jane Smith',
      category: 'claim_evidence',
      file_path: 'documents/claim/claim-1/evidence.zip',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      version: 1,
      status: 'active',
      approval_status: 'approved'
    },
    {
      id: 'doc-3',
      document_name: 'Sales Proposal - XYZ Corp.docx',
      document_type: 'proposal',
      entity_type: 'sales_process',
      entity_id: 'sales-1',
      uploaded_by_id: 'user-3',
      uploaded_by_name: 'Bob Wilson',
      category: 'correspondence',
      file_path: 'documents/sales/sales-1/proposal.docx',
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      version: 2,
      status: 'active',
      approval_status: 'needs_review'
    }
  ]);

  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch = !searchTerm || 
      doc.document_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.document_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEntity = entityFilter === "all" || doc.entity_type === entityFilter;
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || doc.approval_status === statusFilter;
    
    return matchesSearch && matchesEntity && matchesCategory && matchesStatus;
  });

  const getEntityIcon = (entityType: EntityType) => {
    switch (entityType) {
      case 'policy':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'claim':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'sales_process':
        return <Users className="h-4 w-4 text-green-600" />;
      default:
        return <FolderOpen className="h-4 w-4 text-gray-600" />;
    }
  };

  const getApprovalStatusBadge = (status?: string) => {
    if (!status) return null;
    
    return (
      <Badge className={getApprovalStatusColor(status as any)}>
        {t(status)}
      </Badge>
    );
  };

  const handleDocumentAction = (action: string, document: Document) => {
    switch (action) {
      case 'view':
        toast.info(t("openingDocument"), { description: document.document_name });
        break;
      case 'download':
        toast.info(t("downloadingDocument"), { description: document.document_name });
        break;
      case 'edit':
        setSelectedDocument(document);
        break;
      case 'delete':
        toast.info(t("deletingDocument"), { description: document.document_name });
        break;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("documentManagement")}</h1>
          <p className="text-muted-foreground">
            {t("centralDocumentRepository")}
          </p>
        </div>
        <Button onClick={() => setUploadDialog(true)}>
          <Upload className="mr-2 h-4 w-4" />
          {t("uploadDocument")}
        </Button>
      </div>

      {/* Document Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{allDocuments.length}</p>
                <p className="text-sm text-muted-foreground">{t("totalDocuments")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{approvalStats.pending}</p>
                <p className="text-sm text-muted-foreground">{t("pendingApprovals")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{approvalStats.approved}</p>
                <p className="text-sm text-muted-foreground">{t("approvedDocuments")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{approvalStats.overdue}</p>
                <p className="text-sm text-muted-foreground">{t("overdueApprovals")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">{t("allDocuments")}</TabsTrigger>
          <TabsTrigger value="pending">{t("pendingApproval")}</TabsTrigger>
          <TabsTrigger value="approved">{t("approved")}</TabsTrigger>
          <TabsTrigger value="analytics">{t("analytics")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Archive className="h-5 w-5" />
                  {t("documentRepository")}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t("searchDocuments")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={entityFilter} onValueChange={(value: any) => setEntityFilter(value)}>
                  <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder={t("filterByEntity")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allEntities")}</SelectItem>
                    <SelectItem value="policy">{t("policies")}</SelectItem>
                    <SelectItem value="claim">{t("claims")}</SelectItem>
                    <SelectItem value="sales_process">{t("sales")}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={(value: any) => setCategoryFilter(value)}>
                  <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder={t("filterByCategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allCategories")}</SelectItem>
                    <SelectItem value="policy">{t("policyDocuments")}</SelectItem>
                    <SelectItem value="claim">{t("claimDocuments")}</SelectItem>
                    <SelectItem value="correspondence">{t("correspondence")}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder={t("filterByStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allStatuses")}</SelectItem>
                    <SelectItem value="pending">{t("pending")}</SelectItem>
                    <SelectItem value="approved">{t("approved")}</SelectItem>
                    <SelectItem value="rejected">{t("rejected")}</SelectItem>
                    <SelectItem value="needs_review">{t("needsReview")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Documents Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("document")}</TableHead>
                      <TableHead>{t("entity")}</TableHead>
                      <TableHead>{t("category")}</TableHead>
                      <TableHead>{t("uploadedBy")}</TableHead>
                      <TableHead>{t("status")}</TableHead>
                      <TableHead>{t("uploadDate")}</TableHead>
                      <TableHead className="w-[100px]">{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {getEntityIcon(document.entity_type)}
                            <div>
                              <p className="font-medium text-sm">{document.document_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {document.document_type} • v{document.version}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {t(document.entity_type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {t(document.category)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{document.uploaded_by_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(document.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getApprovalStatusBadge(document.approval_status)}
                        </TableCell>
                        <TableCell>
                          {new Date(document.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDocumentAction('view', document)}>
                                <Eye className="mr-2 h-4 w-4" />
                                {t("viewDocument")}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDocumentAction('download', document)}>
                                <Download className="mr-2 h-4 w-4" />
                                {t("download")}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDocumentAction('edit', document)}>
                                <Edit className="mr-2 h-4 w-4" />
                                {t("editMetadata")}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDocumentAction('delete', document)}
                                className="text-destructive"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                {t("delete")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredDocuments.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t("noDocumentsFound")}</h3>
                  <p className="text-muted-foreground mb-4">{t("tryDifferentFilters")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t("pendingApprovals")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDocuments
                  .filter(doc => doc.approval_status === 'pending')
                  .map((document) => (
                    <div key={document.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getEntityIcon(document.entity_type)}
                          <div>
                            <p className="font-medium">{document.document_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {t(document.entity_type)} • {t(document.category)}
                            </p>
                          </div>
                        </div>
                        <Badge className={getPriorityColor('medium')}>
                          {t("medium")}
                        </Badge>
                      </div>
                      
                      <DocumentApprovalPanel
                        documentId={document.id}
                        compact={true}
                        showActions={true}
                      />
                    </div>
                  ))}
                
                {filteredDocuments.filter(doc => doc.approval_status === 'pending').length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">{t("noPendingApprovals")}</h3>
                    <p className="text-muted-foreground">{t("allDocumentsApproved")}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                {t("approvedDocuments")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredDocuments
                  .filter(doc => doc.approval_status === 'approved')
                  .map((document) => (
                    <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50/50">
                      <div className="flex items-center gap-3">
                        {getEntityIcon(document.entity_type)}
                        <div>
                          <p className="font-medium text-sm">{document.document_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {t("approvedBy")} {document.uploaded_by_name} • {new Date(document.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">
                          {t("approved")}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => handleDocumentAction('view', document)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("approvalMetrics")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{t("approvalRate")}</span>
                    <span className="font-medium">{approvalStats.approvalRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{t("averageApprovalTime")}</span>
                    <span className="font-medium">2.3 {t("days")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{t("overdueRate")}</span>
                    <span className="font-medium text-red-600">
                      {approvalStats.total > 0 ? Math.round((approvalStats.overdue / approvalStats.total) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("documentsByCategory")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['policy', 'claim', 'correspondence'].map(category => {
                    const count = allDocuments.filter(doc => doc.category === category).length;
                    const percentage = allDocuments.length > 0 ? Math.round((count / allDocuments.length) * 100) : 0;
                    
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                          <span className="text-sm">{t(category)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{count}</span>
                          <span className="text-xs text-muted-foreground">({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Upload Dialog */}
      <DocumentUploadDialog
        open={uploadDialog}
        onOpenChange={setUploadDialog}
        entityType="policy"
        entityId="temp"
        selectedDocument={selectedDocument}
      />
    </div>
  );
};

export default DocumentsHub;