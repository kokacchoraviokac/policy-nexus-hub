
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import InsurerForm from '../forms/InsurerForm';
import { useToast } from '@/hooks/use-toast';
import { Insurer } from '@/types/codebook';

interface AddInsurerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Insurer>) => void;
}

const AddInsurerDialog: React.FC<AddInsurerDialogProps> = ({
  open,
  onOpenChange,
  onSubmit
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Partial<Insurer>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onOpenChange(false);
      toast({
        title: t('insurerAdded'),
        description: t('insurerAddedSuccessfully')
      });
    } catch (error) {
      console.error('Error adding insurer:', error);
      toast({
        title: t('addFailed'),
        description: t('failedToAddInsurer'),
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
          <DialogTitle>{t('addInsurer')}</DialogTitle>
        </DialogHeader>
        <InsurerForm
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          isEditMode={false}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddInsurerDialog;
