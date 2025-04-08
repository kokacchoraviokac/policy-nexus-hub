
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useSimpleSavedFilters } from '@/hooks/useSimpleSavedFilters';
import { CodebookFilterState } from '@/types/codebook';

interface SimpleSavedFiltersButtonProps {
  entityType: 'clients' | 'insurers' | 'products';
  currentFilters: CodebookFilterState;
}

const SimpleSavedFiltersButton: React.FC<SimpleSavedFiltersButtonProps> = ({
  entityType,
  currentFilters,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterName, setFilterName] = useState('');
  const { saveFilter } = useSimpleSavedFilters(entityType);

  const openDialog = () => {
    setFilterName('');
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSaveCurrentFilter = async (name: string): Promise<void> => {
    try {
      await saveFilter(name, currentFilters);
      toast({
        title: t('filterSaved'),
        description: t('filterSavedSuccessfully'),
      });
    } catch (error) {
      console.error('Error saving filter:', error);
      toast({
        title: t('errorSavingFilter'),
        description: t('pleaseTryAgain'),
        variant: 'destructive',
      });
    }
  };

  const handleSave = async () => {
    if (!filterName.trim()) {
      toast({
        title: t('invalidFilterName'),
        description: t('pleaseEnterValidFilterName'),
        variant: 'destructive',
      });
      return;
    }

    await handleSaveCurrentFilter(filterName);
    closeDialog();
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={openDialog}
        className="flex items-center gap-1"
      >
        <Save className="h-4 w-4" />
        {t('saveFilter')}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('saveCurrentFilter')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder={t('enterFilterName')}
              className="w-full"
            />
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={closeDialog}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSave}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SimpleSavedFiltersButton;
