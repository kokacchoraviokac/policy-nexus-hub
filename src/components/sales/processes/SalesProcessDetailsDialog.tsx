
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SalesProcess } from "@/types/sales/salesProcesses";
import ImportPolicyFromSalesDialog from "./ImportPolicyFromSalesDialog";
import StageBadge from "./badges/StageBadge";
import ClientInformation from "./sections/ClientInformation";
import ProcessDetails from "./sections/ProcessDetails";
import NotesSection from "./sections/NotesSection";
import QuoteInformation from "./sections/QuoteInformation";
import DialogFooterActions from "./sections/DialogFooterActions";

interface SalesProcessDetailsDialogProps {
  process: SalesProcess;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SalesProcessDetailsDialog: React.FC<SalesProcessDetailsDialogProps> = ({
  process,
  open,
  onOpenChange,
}) => {
  const { t } = useLanguage();
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{process.title}</span>
              <StageBadge stage={process.stage} />
            </DialogTitle>
            {process.company && (
              <DialogDescription>
                {process.company}
              </DialogDescription>
            )}
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <ClientInformation process={process} />
              <ProcessDetails process={process} />
            </div>
            
            <NotesSection notes={process.notes} />
            <QuoteInformation process={process} />
          </div>
          
          <DialogFooter>
            <DialogFooterActions
              process={process}
              onClose={() => onOpenChange(false)}
              onImportPolicy={() => setImportDialogOpen(true)}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImportPolicyFromSalesDialog 
        process={process}
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
      />
    </>
  );
};

export default SalesProcessDetailsDialog;
