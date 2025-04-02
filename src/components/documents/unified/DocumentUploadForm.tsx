
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useDropzone } from "react-dropzone";
import { FilePlus, X } from "lucide-react";
import { DocumentCategory } from "@/types/documents";

interface DocumentUploadFormProps {
  documentName: string;
  setDocumentName: (name: string) => void;
  documentType: string;
  setDocumentType: (type: string) => void;
  documentCategory: string;
  setDocumentCategory: (category: string) => void;
  file: File | null;
  handleFileChange: (file: File | null) => void;
  isNewVersion?: boolean;
  isSalesProcess?: boolean;
  salesStage?: string;
}

const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({
  documentName,
  setDocumentName,
  documentType,
  setDocumentType,
  documentCategory,
  setDocumentCategory,
  file,
  handleFileChange,
  isNewVersion = false,
  isSalesProcess = false,
  salesStage
}) => {
  const { t } = useLanguage();

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      handleFileChange(acceptedFiles[0]);
    }
  }, [handleFileChange]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });
  
  // Get document category options based on entity type
  const getCategoryOptions = () => {
    if (isSalesProcess) {
      return [
        { value: "discovery", label: t("discovery") },
        { value: "quote", label: t("quoteManagement") },
        { value: "proposal", label: t("proposals") },
        { value: "contract", label: t("contracts") },
        { value: "closeout", label: t("closeout") }
      ];
    }
    
    // Default categories for other entity types
    return [
      { value: "policy", label: t("policy") },
      { value: "claim", label: t("claim") },
      { value: "invoice", label: t("invoice") },
      { value: "legal", label: t("legal") },
      { value: "correspondence", label: t("correspondence") },
      { value: "other", label: t("other") }
    ];
  };
  
  // Get document type options based on category
  const getDocumentTypeOptions = () => {
    if (isSalesProcess) {
      switch(documentCategory) {
        case "discovery":
          return [
            { value: "client_requirements", label: t("clientRequirements") },
            { value: "needs_analysis", label: t("needsAnalysis") },
            { value: "meeting_notes", label: t("meetingNotes") }
          ];
        case "quote":
          return [
            { value: "quote_request", label: t("quoteRequest") },
            { value: "insurer_quote", label: t("insurerQuote") },
            { value: "price_comparison", label: t("priceComparison") }
          ];
        case "proposal":
          return [
            { value: "proposal_draft", label: t("proposalDraft") },
            { value: "proposal_final", label: t("proposalFinal") },
            { value: "client_feedback", label: t("clientFeedback") }
          ];
        case "contract":
          return [
            { value: "contract_draft", label: t("contractDraft") },
            { value: "signed_contract", label: t("signedContract") },
            { value: "terms_conditions", label: t("termsAndConditions") }
          ];
        case "closeout":
          return [
            { value: "final_review", label: t("finalReview") },
            { value: "handover_notes", label: t("handoverNotes") },
            { value: "client_approval", label: t("clientApproval") }
          ];
        default:
          return [
            { value: "general", label: t("general") },
            { value: "other", label: t("other") }
          ];
      }
    }
    
    // Default document types
    return [
      { value: "policy", label: t("policy") },
      { value: "contract", label: t("contract") },
      { value: "certificate", label: t("certificate") },
      { value: "invoice", label: t("invoice") },
      { value: "letter", label: t("letter") },
      { value: "report", label: t("report") },
      { value: "other", label: t("other") }
    ];
  };
  
  const categoryOptions = getCategoryOptions();
  const typeOptions = getDocumentTypeOptions();

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          {t("documentName")}
        </Label>
        <Input
          id="name"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          {t("documentCategory")}
        </Label>
        <Select 
          value={documentCategory} 
          onValueChange={setDocumentCategory}
          disabled={isNewVersion}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder={t("selectCategory")} />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map(option => (
              <SelectItem 
                key={option.value} 
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="type" className="text-right">
          {t("documentType")}
        </Label>
        <Select 
          value={documentType} 
          onValueChange={setDocumentType}
        >
          <SelectTrigger id="type" className="col-span-3">
            <SelectValue placeholder={t("selectDocumentType")} />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map(option => (
              <SelectItem 
                key={option.value} 
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">{t("uploadFile")}</Label>
        <div
          {...getRootProps()}
          className="dropzone col-span-3 flex flex-col items-center justify-center border-dashed border-2 border-gray-400 bg-gray-50 rounded-lg cursor-pointer"
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="flex items-center justify-between w-full p-4">
              <span className="text-sm text-gray-500">{file.name}</span>
              <button 
                type="button" 
                className="p-1 rounded-full hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFileChange(null);
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <FilePlus className="h-6 w-6 text-gray-500 mb-2" />
              <p className="text-sm text-gray-500">
                {t("dragAndDropFilesHere")}
              </p>
              <p className="text-xs text-gray-500">
                {t("or")} {t("clickToSelectFiles")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadForm;
