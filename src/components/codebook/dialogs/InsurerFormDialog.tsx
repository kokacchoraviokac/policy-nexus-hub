
import React from 'react';
import { useInsurer } from '@/hooks/useInsurer';
import { useInsurersCrud } from '@/hooks/insurers/useInsurersCrud';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import InsurerForm, { InsurerFormValues } from '../forms/InsurerForm';
import { Insurer } from '@/types/codebook';

interface InsurerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insurerId?: string;
}

const InsurerFormDialog: React.FC<InsurerFormDialogProps> = ({
  open,
  onOpenChange,
  insurerId,
}) => {
  const { t } = useLanguage();
  const { insurer, isLoading: isLoadingInsurer } = useInsurer(insurerId);
  const { addInsurer, updateInsurer, isAdding, isUpdating } = useInsurersCrud();

  const isLoading = isLoadingInsurer || isAdding || isUpdating;
  const isEditMode = !!insurerId;

  const handleSubmit = async (data: InsurerFormValues) => {
    try {
      if (isEditMode && insurerId) {
        await updateInsurer({ 
          id: insurerId, 
          updateData: data 
        });
      } else {
        await addInsurer(data);
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save insurer:', error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? t('editInsurer') : t('addInsurer')}
          </DialogTitle>
        </DialogHeader>

        <InsurerForm
          initialData={insurer}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isEditMode={isEditMode}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InsurerFormDialog;
