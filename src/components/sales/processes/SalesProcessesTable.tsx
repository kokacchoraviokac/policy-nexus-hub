
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  ArrowRight,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SalesProcess } from "@/types/salesProcess";
import SalesProcessDetailsDialog from "./SalesProcessDetailsDialog";
import DeleteSalesProcessDialog from "./DeleteSalesProcessDialog";

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

  // Process stage badge styling
  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'quote':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{t("quoteManagement")}</Badge>;
      case 'authorization':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">{t("clientAuthorization")}</Badge>;
      case 'proposal':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{t("policyProposal")}</Badge>;
      case 'signed':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">{t("signedPolicies")}</Badge>;
      case 'concluded':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{t("concluded")}</Badge>;
      default:
        return <Badge variant="outline">{stage}</Badge>;
    }
  };

  // Insurance type badge styling
  const getInsuranceTypeBadge = (type: string) => {
    switch (type) {
      case 'life':
        return <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">{t("life")}</Badge>;
      case 'nonLife':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{t("nonLife")}</Badge>;
      case 'health':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{t("health")}</Badge>;
      case 'property':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{t("property")}</Badge>;
      case 'auto':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">{t("auto")}</Badge>;
      case 'travel':
        return <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200">{t("travel")}</Badge>;
      case 'business':
        return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">{t("business")}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

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
                  <TableCell>{getStageBadge(process.stage)}</TableCell>
                  <TableCell>{getInsuranceTypeBadge(process.insurance_type)}</TableCell>
                  <TableCell>{format(new Date(process.created_at), "PP")}</TableCell>
                  <TableCell>{process.responsible_person || "-"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">{t("openMenu")}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(process)}>
                          <Eye className="mr-2 h-4 w-4" />
                          {t("viewDetails")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          {t("editProcess")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowRight className="mr-2 h-4 w-4" />
                          {t("moveToNextStage")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(process)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t("deleteProcess")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
