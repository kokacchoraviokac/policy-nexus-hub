
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useAuthSession } from "@/hooks/useAuthSession";

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
  const { t, formatDate } = useLanguage();
  const { toast } = useToast();
  const { session } = useAuthSession();
  
  const [bankName, setBankName] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [statementDate, setStatementDate] = useState<Date | undefined>(undefined);
  const [startingBalance, setStartingBalance] = useState<string>("");
  const [endingBalance, setEndingBalance] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const resetForm = () => {
    setBankName("");
    setAccountNumber("");
    setStatementDate(undefined);
    setStartingBalance("");
    setEndingBalance("");
    setFile(null);
  };
  
  const handleSubmit = async () => {
    if (!bankName || !accountNumber || !statementDate || !startingBalance || !endingBalance || !file) {
      toast({
        title: t("missingFields"),
        description: t("allFieldsRequired"),
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Get the user's company_id from session
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', session?.user?.id)
        .single();
      
      if (userError) {
        throw new Error(t("failedToGetCompanyId"));
      }
      
      if (!userData?.company_id) {
        throw new Error(t("noCompanyAssociated"));
      }
      
      // Create bank statement record
      const { data: statement, error: statementError } = await supabase
        .from('bank_statements')
        .insert({
          bank_name: bankName,
          account_number: accountNumber,
          statement_date: statementDate.toISOString().split('T')[0],
          starting_balance: parseFloat(startingBalance),
          ending_balance: parseFloat(endingBalance),
          status: 'in_progress',
          file_path: file.name, // This will be updated with the actual path
          company_id: userData.company_id
        })
        .select()
        .single();
      
      if (statementError) throw statementError;
      
      // In a real implementation, you'd upload the file to storage and process it
      // For demonstration purposes, we'll just simulate a success
      
      toast({
        title: t("statementUploaded"),
        description: t("statementUploadedSuccess"),
      });
      
      onUploadComplete();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error uploading statement:', error);
      toast({
        title: t("errorUploadingStatement"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{t("uploadBankStatement")}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">{t("bankName")}</Label>
              <Select value={bankName} onValueChange={setBankName}>
                <SelectTrigger id="bankName">
                  <SelectValue placeholder={t("selectBank")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UNICREDIT">UniCredit</SelectItem>
                  <SelectItem value="KOMBANK">Komercijalna Banka</SelectItem>
                  <SelectItem value="RAIFFEISEN">Raiffeisen Bank</SelectItem>
                  <SelectItem value="INTESA">Banca Intesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountNumber">{t("accountNumber")}</Label>
              <Input 
                id="accountNumber" 
                value={accountNumber} 
                onChange={(e) => setAccountNumber(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="statementDate">{t("statementDate")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                  id="statementDate"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {statementDate ? formatDate(statementDate.toISOString()) : t("selectDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={statementDate}
                  onSelect={setStatementDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startingBalance">{t("startingBalance")}</Label>
              <Input 
                id="startingBalance" 
                type="number" 
                step="0.01" 
                value={startingBalance} 
                onChange={(e) => setStartingBalance(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endingBalance">{t("endingBalance")}</Label>
              <Input 
                id="endingBalance" 
                type="number" 
                step="0.01" 
                value={endingBalance} 
                onChange={(e) => setEndingBalance(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="statementFile">{t("statementFile")}</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="statementFile" 
                type="file" 
                accept=".pdf,.csv,.txt,.xlsx" 
                onChange={handleFileChange} 
              />
              {file && (
                <div className="text-sm text-muted-foreground">
                  {file.name}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isUploading}>
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
