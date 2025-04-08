import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw, Search } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useDebounce } from '@/hooks/useDebounce';
import { Insurer } from '@/types/codebook';
import { useInsurers } from '@/hooks/useInsurers';
import InsurerFormDialog from './dialogs/InsurerFormDialog';
import { useToast } from '@/hooks/use-toast';
import { useInsurersCrud } from '@/hooks/insurers/useInsurersCrud';
import SavedFiltersMenu from './filters/SavedFiltersMenu';
import { CodebookFilterState } from '@/types/codebook';
import { PaginationController } from '@/components/ui/pagination-controller';

const InsurersDirectory: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [open, setOpen] = useState(false);
  const [selectedInsurerId, setSelectedInsurerId] = useState<string | undefined>(undefined);
  const [activeOnly, setActiveOnly] = useState(false);
  const [filters, setFilters] = useState<CodebookFilterState>({ status: activeOnly ? 'active' : 'all' });

  const {
    insurers,
    isLoading,
    error,
    totalCount,
    currentPage,
    totalPages,
    onPageChange,
    onPageSizeChange,
    pageSize,
    refreshInsurers,
  } = useInsurers({
    search: debouncedSearchQuery,
    page: 1,
    pageSize: 10,
    status: activeOnly ? 'active' : 'all',
  });

  const { deleteInsurer, isDeleting } = useInsurersCrud();

  const handleOpenDialog = () => {
    setSelectedInsurerId(undefined);
    setOpen(true);
  };

  const handleEditInsurer = (id: string) => {
    setSelectedInsurerId(id);
    setOpen(true);
  };

  const handleDeleteInsurer = async (id: string) => {
    try {
      await deleteInsurer(id); // Instead of passing two arguments
      toast({
        title: t('insurerDeleted'),
        description: t('insurerDeletedSuccessfully'),
      });
    } catch (err) {
      console.error('Error deleting insurer:', err);
      toast({
        title: t('errorDeletingInsurer'),
        description: t('pleaseTryAgain'),
        variant: 'destructive',
      });
    }
  };

  const columns: ColumnDef<Insurer>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
    },
    {
      accessorKey: 'contact_person',
      header: t('contactPerson'),
    },
    {
      accessorKey: 'email',
      header: t('email'),
    },
    {
      accessorKey: 'phone',
      header: t('phone'),
    },
    {
      accessorKey: 'is_active',
      header: ({ column }) => {
        return (
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              {t('status')}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const isActive = row.original.is_active;
        return (
          <div className="flex items-center">
            {isActive ? t('active') : t('inactive')}
          </div>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEditInsurer(row.original.id)}
          >
            {t('edit')}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteInsurer(row.original.id)}
            disabled={isDeleting}
          >
            {t('delete')}
          </Button>
        </div>
      ),
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRefresh = useCallback(async () => {
    await refreshInsurers();
  }, [refreshInsurers]);

  const handleLoadFilter = (filter: CodebookFilterState) => {
    setFilters(filter);
    setActiveOnly(filter.status === 'active');
  };

  const handleActiveOnlyChange = (checked: boolean) => {
    setActiveOnly(checked);
    setFilters({ status: checked ? 'active' : 'all' });
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>{t('insurers')}</CardTitle>
              <CardDescription>{t('manageInsurers')}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <SavedFiltersMenu
                entityType="insurers"
                currentFilters={filters}
                onLoadFilter={handleLoadFilter}
              />
              <Button onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('refresh')}
              </Button>
              <Button onClick={handleOpenDialog}>
                <PlusCircle className="h-4 w-4 mr-2" />
                {t('addInsurer')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('searchInsurers')}
                className="pl-10"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="activeOnly">{t('activeOnly')}</Label>
              <Checkbox
                id="activeOnly"
                checked={activeOnly}
                onCheckedChange={handleActiveOnlyChange}
              />
            </div>
          </div>
          <DataTable
            columns={columns}
            data={insurers}
            keyField="id"
            isLoading={isLoading}
            error={error}
            onRefresh={handleRefresh}
            onSearch={handleSearch}
            searchPlaceholder={t('searchInsurers')}
            emptyMessage={t('noInsurersFound')}
          />
          <PaginationController
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            pageSize={pageSize}
            totalCount={totalCount}
          />
        </CardContent>
      </Card>
      <InsurerFormDialog
        open={open}
        onOpenChange={setOpen}
        insurerId={selectedInsurerId}
      />
    </div>
  );
};

export default InsurersDirectory;
