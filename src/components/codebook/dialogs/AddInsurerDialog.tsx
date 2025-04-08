
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import InsurerForm from "./InsurerForm";
import { Insurer } from "@/types/documents";

interface AddInsurerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (insurer: Partial<Insurer>) => Promise<void>;
}

const AddInsurerDialog: React.FC<AddInsurerDialogProps> = ({
  open,
  onOpenChange,
  onSubmit
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: Partial<Insurer>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onOpenChange(false);
      toast({
        title: t("insurerCreated"),
        description: t("insurerCreatedSuccessfully")
      });
    } catch (error) {
      console.error("Failed to create insurer:", error);
      toast({
        title: t("createFailed"),
        description: t("failedToCreateInsurer"),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("addInsurer")}</DialogTitle>
        </DialogHeader>
        
        <InsurerForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting}
        />
        
        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {t("cancel")}
          </Button>
          <Button 
            type="submit"
            form="insurer-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("creating")}
              </>
            ) : (
              t("create")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddInsurerDialog;
