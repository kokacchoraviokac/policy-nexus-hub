
import React from "react";
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
import { 
  DownloadCloud, 
  Eye, 
  FileText, 
  FilePen, 
  FileArchive, 
  FileSpreadsheet,
  FileImage,
  FileQuestion
} from "lucide-react";

export interface PolicyDocumentsTableProps {
  searchTerm: string;
  documentType: string;
}

const PolicyDocumentsTable: React.FC<PolicyDocumentsTableProps> = ({
  searchTerm,
  documentType
}) => {
  const { t, formatDate } = useLanguage();
  
  // Placeholder data
  const documents = [
    {
      id: '1',
      document_name: 'Policy Contract.pdf',
      document_type: 'policy',
      file_path: '/documents/policy1.pdf',
      uploaded_by_name: 'John Doe',
      created_at: '2023-05-15T10:30:00Z',
    },
    {
      id: '2',
      document_name: 'Invoice 2023-001.pdf',
      document_type: 'invoice',
      file_path: '/documents/invoice1.pdf',
      uploaded_by_name: 'Jane Smith',
      created_at: '2023-05-16T09:15:00Z',
    }
  ];
  
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'policy':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'addendum':
        return <FilePen className="h-4 w-4 text-orange-500" />;
      case 'invoice':
        return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
      case 'claim':
        return <FileArchive className="h-4 w-4 text-red-500" />;
      case 'image':
        return <FileImage className="h-4 w-4 text-purple-500" />;
      default:
        return <FileQuestion className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchTerm || 
      doc.document_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = documentType === 'all' || doc.document_type === documentType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">{t("documentName")}</TableHead>
            <TableHead>{t("documentType")}</TableHead>
            <TableHead>{t("uploadedBy")}</TableHead>
            <TableHead>{t("uploadDate")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDocuments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                {t("noDocumentsFound")}
              </TableCell>
            </TableRow>
          ) : (
            filteredDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium flex items-center">
                  {getDocumentIcon(doc.document_type)}
                  <span className="ml-2">{doc.document_name}</span>
                </TableCell>
                <TableCell>{t(doc.document_type)}</TableCell>
                <TableCell>{doc.uploaded_by_name}</TableCell>
                <TableCell>{formatDate(doc.created_at)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" title={t("viewDocument")}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title={t("downloadDocument")}>
                    <DownloadCloud className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PolicyDocumentsTable;
