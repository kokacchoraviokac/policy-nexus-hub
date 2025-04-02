
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SalesProcess } from "@/types/salesProcess";
import SalesProcessDetailsDialog from "./SalesProcessDetailsDialog";
import DeleteSalesProcessDialog from "./DeleteSalesProcessDialog";
import ProcessStageBadge from "./table/ProcessStageBadge";
import ProcessInsuranceTypeBadge from "./table/ProcessInsuranceTypeBadge";
import ProcessActionsMenu from "./table/ProcessActionsMenu";

interface SalesProcessesTableProps {
  salesProcesses: SalesProcess[];
  onRefresh: () => void;
}

const SalesProcessesTable: React.FC<SalesProcessesTableProps> = ({
  salesProcesses,
  onRefresh,
}) => {
  const { t } = useLanguage();
  const [selectedProcess, setSelectedProcess] = useState<SalesProcess | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleViewDetails = (process: SalesProcess) => {
    setSelectedProcess(process);
    setDetailsOpen(true);
  };

  const handleDelete = (process: SalesProcess) => {
    setSelectedProcess(process);
    setDeleteOpen(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("title")}</TableHead>
              <TableHead>{t("client")}</TableHead>
              <TableHead>{t("stage")}</TableHead>
              <TableHead>{t("insuranceType")}</TableHead>
              <TableHead>{t("createdAt")}</TableHead>
              <TableHead>{t("responsiblePerson")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesProcesses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {t("noSalesProcessesFound")}
                </TableCell>
              </TableRow>
            ) : (
              salesProcesses.map((process) => (
                <TableRow key={process.id}>
                  <TableCell className="font-medium">
                    {process.title}
                    {process.company && <div className="text-xs text-muted-foreground">{process.company}</div>}
                  </TableCell>
                  <TableCell>{process.client_name}</TableCell>
                  <TableCell>
                    <ProcessStageBadge stage={process.stage} />
                  </TableCell>
                  <TableCell>
                    <ProcessInsuranceTypeBadge type={process.insurance_type} />
                  </TableCell>
                  <TableCell>{format(new Date(process.created_at), "PP")}</TableCell>
                  <TableCell>{process.responsible_person || "-"}</TableCell>
                  <TableCell className="text-right">
                    <ProcessActionsMenu 
                      process={process} 
                      onView={handleViewDetails} 
                      onDelete={handleDelete}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedProcess && (
        <>
          <SalesProcessDetailsDialog 
            process={selectedProcess} 
            open={detailsOpen} 
            onOpenChange={setDetailsOpen} 
          />
          <DeleteSalesProcessDialog 
            process={selectedProcess} 
            open={deleteOpen} 
            onOpenChange={setDeleteOpen} 
            onProcessDeleted={onRefresh} 
          />
        </>
      )}
    </>
  );
};

export default SalesProcessesTable;
