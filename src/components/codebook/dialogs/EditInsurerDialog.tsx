
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Insurer } from "@/types/codebook";
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
import { supabase } from "@/integrations/supabase/client";

interface EditInsurerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insurerId: string;
  onSubmit: (insurer: Partial<Insurer>) => Promise<void>;
}

const EditInsurerDialog: React.FC<EditInsurerDialogProps> = ({
  open,
  onOpenChange,
  insurerId,
  onSubmit
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [insurer, setInsurer] = useState<Insurer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && insurerId) {
      fetchInsurer();
    }
  }, [open, insurerId]);

  const fetchInsurer = async () => {
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
      console.error("Error fetching insurer:", error);
      toast({
        title: t("error"),
        description: t("failedToFetchInsurer"),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: Partial<Insurer>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("editInsurer")}</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center my-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : insurer ? (
          <InsurerForm 
            defaultValues={insurer} 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
          />
        ) : (
          <p className="text-center text-muted-foreground">
            {t("insurerNotFound")}
          </p>
        )}
        
        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {t("cancel")}
          </Button>
          {!isLoading && insurer && (
            <Button 
              type="submit"
              form="insurer-form"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("updating")}
                </>
              ) : (
                t("update")
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditInsurerDialog;
