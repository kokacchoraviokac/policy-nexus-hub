
// Find the problematic line around 102 and change it to return a Promise
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
