
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BankStatementUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: () => void;
}

const BankStatementUploadDialog: React.FC<BankStatementUploadDialogProps> = ({
  open,
  onOpenChange,
  onUploadComplete
}) => {
  const { t } = useLanguage();
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [statementFile, setStatementFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setStatementFile(file);
  };
  
  const handleSubmit = async () => {
    if (!bank || !accountNumber || !statementFile) return;
    
    setIsUploading(true);
    
    // Simulate upload - replace with actual API call
    setTimeout(() => {
      setIsUploading(false);
      onUploadComplete();
      onOpenChange(false);
      
      // Reset form
      setBank("");
      setAccountNumber("");
      setStatementFile(null);
    }, 1500);
  };
  
  const banks = [
    { value: "unicredit", label: "UniCredit" },
    { value: "kombank", label: "Komercijalna Banka" },
    { value: "intesa", label: "Banca Intesa" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("uploadBankStatement")}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="bank">{t("selectBank")}</Label>
            <Select value={bank} onValueChange={setBank}>
              <SelectTrigger id="bank">
                <SelectValue placeholder={t("selectBank")} />
              </SelectTrigger>
              <SelectContent>
                {banks.map(bank => (
                  <SelectItem key={bank.value} value={bank.value}>
                    {bank.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="accountNumber">{t("accountNumber")}</Label>
            <Input
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder={t("enterAccountNumber")}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="statementFile">{t("statementFile")}</Label>
            <Input
              id="statementFile"
              type="file"
              accept=".pdf,.csv,.txt"
              onChange={handleFileChange}
            />
            {statementFile && (
              <p className="text-sm text-muted-foreground">
                {t("selectedFile")}: {statementFile.name} ({Math.round(statementFile.size / 1024)} KB)
              </p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            {t("cancel")}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!bank || !accountNumber || !statementFile || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("uploading")}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {t("upload")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BankStatementUploadDialog;
