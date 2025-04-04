
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react"; // Fixed import

interface AddQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuoteAdded: (quoteData: any) => void;
}

const AddQuoteDialog: React.FC<AddQuoteDialogProps> = ({ open, onOpenChange, onQuoteAdded }) => {
  const { t } = useLanguage();
  const [insurer, setInsurer] = useState("");
  const [amount, setAmount] = useState("");
  const [coverage, setCoverage] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!insurer || !amount || !coverage) {
      return;
    }
    
    // Create and submit quote
    const quoteData = {
      insurerName: insurer,
      amount,
      coverageDetails: coverage,
      // Add other required fields here
    };
    
    onQuoteAdded(quoteData);
    onOpenChange(false);
    
    // Reset form
    setInsurer("");
    setAmount("");
    setCoverage("");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("addNewQuote")}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="insurer">{t("insurer")}</Label>
            <Input
              id="insurer"
              value={insurer}
              onChange={(e) => setInsurer(e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="amount">{t("amount")}</Label>
            <Input
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="coverage">{t("coverageDetails")}</Label>
            <Textarea
              id="coverage"
              value={coverage}
              onChange={(e) => setCoverage(e.target.value)}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit">{t("addQuote")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddQuoteDialog;
