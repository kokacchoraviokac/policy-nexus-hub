
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2, Upload } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface BankStatementUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: () => void;
}

const BankStatementUploadDialog: React.FC<BankStatementUploadDialogProps> = ({
  open,
  onOpenChange,
  onUploadComplete,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [statementDate, setStatementDate] = useState<Date | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bank || !accountNumber || !statementDate || !file) {
      toast({
        title: t("validationError"),
        description: t("pleaseCompleteAllFields"),
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Here, you would implement the actual upload functionality
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: t("uploadComplete"),
        description: t("statementUploadedSuccessfully"),
      });
      
      onUploadComplete();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error uploading statement:", error);
      toast({
        title: t("uploadError"),
        description: t("errorUploadingStatement"),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const resetForm = () => {
    setBank("");
    setAccountNumber("");
    setStatementDate(undefined);
    setFile(null);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("uploadStatement")}</DialogTitle>
          <DialogDescription>
            {t("uploadStatementDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="bank">{t("bank")}</Label>
            <Select value={bank} onValueChange={setBank}>
              <SelectTrigger id="bank">
                <SelectValue placeholder={t("selectBank")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UNICREDIT">UniCredit</SelectItem>
                <SelectItem value="KOMBANK">Komercijalna Banka</SelectItem>
                <SelectItem value="RAIFFEISEN">Raiffeisen Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="accountNumber">{t("accountNumber")}</Label>
            <Input
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="123-456789-10"
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t("statementDate")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {statementDate ? (
                    format(statementDate, "PPP")
                  ) : (
                    <span>{t("selectDate")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={statementDate}
                  onSelect={(date) => setStatementDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">{t("statementFile")}</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.csv,.txt"
              onChange={handleFileChange}
            />
            <p className="text-sm text-muted-foreground">
              {t("supportedFormats")}: PDF, CSV, TXT
            </p>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isUploading}>
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
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BankStatementUploadDialog;
