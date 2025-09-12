
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  ExternalLink, 
  Edit, 
  Trash,
  FileUp
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { SalesProcess } from "@/types/sales/salesProcesses";
import { format } from "date-fns";
import DeleteSalesProcessDialog from "./DeleteSalesProcessDialog";
import SalesProcessDetailsDialog from "./SalesProcessDetailsDialog";
import ImportPolicyFromSalesDialog from "./ImportPolicyFromSalesDialog";

interface SalesProcessesTableProps {
  salesProcesses: SalesProcess[];
  onRefresh: () => void;
}

const StageBadge = ({ stage }: { stage: string }) => {
  const { t } = useLanguage();
  
  const getVariant = () => {
    switch (stage) {
      case "quote": return "default";
      case "authorization": return "secondary";
      case "proposal": return "outline";
      case "signed": return "success";
      case "concluded": return "success";
      default: return "outline";
    }
  };
  
  return <Badge variant={getVariant() as any}>{t(stage)}</Badge>;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  try {
    return format(new Date(dateStr), "MMM d, yyyy");
  } catch (e) {
    return dateStr;
  }
};

const SalesProcessesTable: React.FC<SalesProcessesTableProps> = ({
  salesProcesses,
  onRefresh,
}) => {
  const { t } = useLanguage();
  const [selectedProcess, setSelectedProcess] = useState<SalesProcess | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  
  console.log("SalesProcessesTable rendering with:", salesProcesses.length, "processes");
  
  return (
    <>
      {salesProcesses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t("noSalesProcessesFound")}</p>
          <p className="text-sm text-muted-foreground mt-2">{t("createFirstSalesProcess")}</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("title")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("client")}</TableHead>
                <TableHead>{t("stage")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("insuranceType")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("expectedCloseDate")}</TableHead>
                <TableHead className="w-[80px]">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesProcesses.map((process) => (
                <TableRow key={process.id}>
                  <TableCell className="font-medium">
                    {process.title}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {process.client_name}
                  </TableCell>
                  <TableCell>
                    <StageBadge stage={process.stage} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {t(process.insurance_type)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(process.expected_close_date)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">{t("openMenu")}</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t("processActions")}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          setSelectedProcess(process);
                          setDetailsDialogOpen(true);
                        }}>
                          <ExternalLink className="mr-2 h-4 w-4" /> {t("viewDetails")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" /> {t("edit")}
                        </DropdownMenuItem>
                        
                        {process.stage === "concluded" && process.status === "completed" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                              setSelectedProcess(process);
                              setImportDialogOpen(true);
                            }}>
                              <FileUp className="mr-2 h-4 w-4" /> {t("importPolicy")}
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedProcess(process);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" /> {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {selectedProcess && (
        <>
          <DeleteSalesProcessDialog 
            process={selectedProcess}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onProcessDeleted={onRefresh}
          />
          
          <SalesProcessDetailsDialog
            process={selectedProcess}
            open={detailsDialogOpen}
            onOpenChange={setDetailsDialogOpen}
          />
          
          <ImportPolicyFromSalesDialog
            process={selectedProcess}
            open={importDialogOpen}
            onOpenChange={setImportDialogOpen}
          />
        </>
      )}
    </>
  );
};

export default SalesProcessesTable;
