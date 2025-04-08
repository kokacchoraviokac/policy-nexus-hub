
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import InsurerForm from '../forms/InsurerForm';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Insurer } from '@/types/codebook';

interface EditInsurerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insurerId: string;
  onSubmit: (data: { id: string; updateData: Partial<Insurer> }) => void;
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
        .from('insurers')
        .select('*')
        .eq('id', insurerId)
        .single();

      if (error) throw error;
      setInsurer(data as Insurer);
    } catch (error) {
      console.error('Error fetching insurer:', error);
      toast({
        title: t('fetchFailed'),
        description: t('failedToFetchInsurer'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (updateData: Partial<Insurer>) => {
    if (!insurerId) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({ id: insurerId, updateData });
      onOpenChange(false);
      toast({
        title: t('insurerUpdated'),
        description: t('insurerUpdatedSuccessfully')
      });
    } catch (error) {
      console.error('Error updating insurer:', error);
      toast({
        title: t('updateFailed'),
        description: t('failedToUpdateInsurer'),
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('editInsurer')}</DialogTitle>
        </DialogHeader>
        {!isLoading && insurer && (
          <InsurerForm
            initialData={insurer}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            isEditMode={true}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditInsurerDialog;
