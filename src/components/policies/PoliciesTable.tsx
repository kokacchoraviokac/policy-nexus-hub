
import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Policy } from '@/types/policies';
import { formatDate } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import PolicyStatusBadge from './PolicyStatusBadge';
import Pagination from '@/components/ui/pagination';
import { PaginationControllerProps } from '@/types/common';
import { useLanguage } from '@/contexts/LanguageContext';

interface PoliciesTableProps {
  policies: Policy[];
  onViewPolicy: (policyId: string) => void;
  pagination: PaginationControllerProps;
}

const PoliciesTable: React.FC<PoliciesTableProps> = ({ policies, onViewPolicy, pagination }) => {
  const { t } = useLanguage();
  
  const columns: ColumnDef<Policy>[] = [
    {
      accessorKey: 'policy_number',
      header: t('policyNumber'),
    },
    {
      accessorKey: 'client_name',
      header: t('clientName'),
    },
    {
      accessorKey: 'insurer_name',
      header: t('insurerName'),
    },
    {
      accessorKey: 'product_name',
      header: t('productName'),
    },
    {
      accessorKey: 'start_date',
      header: t('startDate'),
      cell: ({ row }) => formatDate(row.getValue('start_date') as string, 'dd MMM yyyy'),
    },
    {
      accessorKey: 'expiry_date',
      header: t('expiryDate'),
      cell: ({ row }) => formatDate((row.getValue('expiry_date') as string) || '', 'dd MMM yyyy')
    },
    {
      accessorKey: 'premium',
      header: t('premium'),
      cell: ({ row }) => {
        const premium = row.getValue('premium') as number;
        const currency = row.getValue('currency') as string;
        return `${premium} ${currency}`;
      }
    },
    {
      accessorKey: 'status',
      header: t('status'),
      cell: ({ row }) => <PolicyStatusBadge status={row.getValue('status') as string} />
    },
    {
      id: 'actions',
      header: t('actions'),
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => onViewPolicy(row.original.id)}>
          <Eye className="h-4 w-4 mr-2" />
          {t('view')}
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: policies,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        page={pagination.currentPage}
        total_pages={pagination.totalPages}
        onPageChange={pagination.onPageChange}
        itemsCount={pagination.totalCount}
        itemsPerPage={pagination.pageSize}
      />
    </>
  );
};

export default PoliciesTable;
