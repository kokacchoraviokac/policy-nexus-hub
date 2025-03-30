
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CommissionType } from '@/types/finances';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CommissionStatusBadge from './CommissionStatusBadge';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import UpdateCommissionStatusDialog from './UpdateCommissionStatusDialog';
import CreateInvoiceFromCommissionButton from './CreateInvoiceFromCommissionButton';

interface CommissionsTableProps {
  commissions: CommissionType[];
  isLoading: boolean;
  updateCommissionStatus: (data: { commissionId: string; status: CommissionType['status']; paymentDate?: string; paidAmount?: number }) => void;
  isUpdating: boolean;
}

const CommissionsTable: React.FC<CommissionsTableProps> = ({
  commissions,
  isLoading,
  updateCommissionStatus,
  isUpdating,
}) => {
  const { t, formatCurrency, formatDate } = useLanguage();
  const [selectedCommission, setSelectedCommission] = React.useState<CommissionType | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (commissions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t('noCommissionsFound')}</p>
        <p className="text-sm text-muted-foreground mt-2">{t('adjustFiltersForCommissions')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('policyNumber')}</TableHead>
              <TableHead>{t('policyholder')}</TableHead>
              <TableHead>{t('insurer')}</TableHead>
              <TableHead className="text-right">{t('baseAmount')}</TableHead>
              <TableHead className="text-right">{t('rate')}</TableHead>
              <TableHead className="text-right">{t('calculatedCommission')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead>{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions.map((commission) => {
              // Pull out the policy details from the commission through relation
              const policy = commission.policy || {};
              return (
                <TableRow key={commission.id}>
                  <TableCell>{policy.policy_number}</TableCell>
                  <TableCell>{policy.policyholder_name}</TableCell>
                  <TableCell>{policy.insurer_name}</TableCell>
                  <TableCell className="text-right">{formatCurrency(commission.base_amount)}</TableCell>
                  <TableCell className="text-right">{commission.rate}%</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(commission.calculated_amount)}</TableCell>
                  <TableCell>
                    <CommissionStatusBadge status={commission.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCommission(commission)}
                        disabled={isUpdating}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        {t('updateStatus')}
                      </Button>
                      
                      <CreateInvoiceFromCommissionButton
                        commissionId={commission.id}
                        policyId={commission.policy_id}
                        disabled={commission.status === 'calculating' || isUpdating}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {selectedCommission && (
        <UpdateCommissionStatusDialog
          open={!!selectedCommission}
          onOpenChange={(open) => !open && setSelectedCommission(null)}
          commission={selectedCommission}
          onUpdate={updateCommissionStatus}
          isUpdating={isUpdating}
        />
      )}
    </>
  );
};

export default CommissionsTable;
