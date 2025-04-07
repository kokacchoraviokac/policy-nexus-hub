
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableSkeletonLoaderProps {
  columns: number;
  rows?: number;
}

const TableSkeletonLoader: React.FC<TableSkeletonLoaderProps> = ({
  columns,
  rows = 5,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {Array(columns)
              .fill(0)
              .map((_, i) => (
                <TableHead key={`header-${i}`}>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array(rows)
            .fill(0)
            .map((_, rowIndex) => (
              <TableRow key={`row-${rowIndex}`}>
                {Array(columns)
                  .fill(0)
                  .map((_, colIndex) => (
                    <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableSkeletonLoader;
