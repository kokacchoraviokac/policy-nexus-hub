
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Receipt } from 'lucide-react';
import { useInvoiceMutations } from '@/hooks/finances/useInvoiceMutations';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CreateInvoiceFromCommissionButtonProps {
  commissionId: string;
  policyId: string;
  disabled?: boolean;
}

const CreateInvoiceFromCommissionButton = ({
  commissionId,
  policyId,
  disabled = false,
}: CreateInvoiceFromCommissionButtonProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { createInvoiceFromCommission, isCreatingFromCommission } = useInvoiceMutations();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleCreateInvoice = () => {
    createInvoiceFromCommission({ commissionId, policyId });
    setConfirmDialogOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        disabled={disabled || isCreatingFromCommission}
        onClick={() => setConfirmDialogOpen(true)}
      >
        <Receipt className="h-4 w-4 mr-1" />
        {t('createInvoice')}
      </Button>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('createInvoiceFromCommission')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('createInvoiceFromCommissionDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateInvoice} disabled={isCreatingFromCommission}>
              {isCreatingFromCommission ? t('creating') : t('createInvoice')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CreateInvoiceFromCommissionButton;
