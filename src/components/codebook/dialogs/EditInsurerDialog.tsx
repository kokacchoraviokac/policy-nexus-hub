
import React, { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

interface EditInsurerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insurerId: string;
  onSubmit: (id: string, insurer: Partial<Insurer>) => Promise<void>;
}

const EditInsurerDialog: React.FC<EditInsurerDialogProps> = ({
  open,
  onOpenChange,
  insurerId,
  onSubmit
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [insurer, setInsurer] = useState<Insurer | null>(null);

  useEffect(() => {
    if (open && insurerId) {
      fetchInsurerDetails();
    }
  }, [open, insurerId]);

  const fetchInsurerDetails = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("insurers")
        .select("*")
        .eq("id", insurerId)
        .single();

      if (error) throw error;
      setInsurer(data as Insurer);
    } catch (error) {
      console.error("Error fetching insurer details:", error);
      toast({
        title: t("fetchError"),
        description: t("errorFetchingInsurerDetails"),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: Partial<Insurer>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(insurerId, data);
      onOpenChange(false);
      toast({
        title: t("insurerUpdated"),
        description: t("insurerUpdatedSuccessfully")
      });
    } catch (error) {
      console.error("Failed to update insurer:", error);
      toast({
        title: t("updateFailed"),
        description: t("failedToUpdateInsurer"),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("editInsurer")}</DialogTitle>
        </DialogHeader>
        
        {insurer && (
          <InsurerForm 
            insurer={insurer}
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
          />
        )}
        
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
                {t("saving")}
              </>
            ) : (
              t("save")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditInsurerDialog;
