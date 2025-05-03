
import * as React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Edit, 
  Trash, 
  ExternalLink,
  FileCheck,
  ArrowUpRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SalesProcess, SalesStage, SalesStatus } from "@/types/sales/salesProcesses";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Define props for the SalesProcessesTable component
interface SalesProcessesTableProps {
  salesProcesses: SalesProcess[];
  onRefresh: () => void;
}

// Stage badge component
const StageBadge = ({ stage }: { stage: SalesStage }) => {
  const getVariant = () => {
    switch (stage) {
      case "quote": return "default";
      case "authorization": return "outline";
      case "request": return "secondary";
      case "proposal": return "secondary";
      case "receipt": return "outline";
      case "signed": return "success";
      case "concluded": return "success";
      default: return "outline";
    }
  };
  
  const { t } = useLanguage();
  
  return <Badge variant={getVariant() as any}>{t(stage)}</Badge>;
};

// Status badge component
const StatusBadge = ({ status }: { status: SalesStatus }) => {
  const getClassNames = () => {
    switch (status) {
      case "active": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "won": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "lost": return "bg-red-100 text-red-800 hover:bg-red-100";
      case "on_hold": return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      default: return "";
    }
  };
  
  const { t } = useLanguage();
  
  return (
    <Badge 
      variant="outline" 
      className={cn("font-medium", getClassNames())}
    >
      {t(status)}
    </Badge>
  );
};

// Format the date for display
const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  try {
    return format(new Date(dateString), "MMM d, yyyy");
  } catch (e) {
    return dateString;
  }
};

const SalesProcessesTable: React.FC<SalesProcessesTableProps> = ({ salesProcesses, onRefresh }) => {
  const { t } = useLanguage();
  const [processToEdit, setProcessToEdit] = React.useState<SalesProcess | null>(null);
  const [processToView, setProcessToView] = React.useState<SalesProcess | null>(null);
  const [processToDelete, setProcessToDelete] = React.useState<SalesProcess | null>(null);
  const [processToImport, setProcessToImport] = React.useState<SalesProcess | null>(null);
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("processTitle")}</TableHead>
              <TableHead className="hidden md:table-cell">{t("clientName")}</TableHead>
              <TableHead>{t("stage")}</TableHead>
              <TableHead className="hidden md:table-cell">{t("status")}</TableHead>
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
                  {process.company && <span className="text-muted-foreground text-xs"> · {process.company}</span>}
                </TableCell>
                <TableCell>
                  <StageBadge stage={process.stage} />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <StatusBadge status={process.status} />
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
                      <DropdownMenuItem onClick={() => setProcessToView(process)}>
                        <ExternalLink className="mr-2 h-4 w-4" /> {t("viewDetails")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setProcessToEdit(process)}>
                        <Edit className="mr-2 h-4 w-4" /> {t("edit")}
                      </DropdownMenuItem>
                      {process.stage === 'concluded' && process.status === 'won' && (
                        <DropdownMenuItem onClick={() => setProcessToImport(process)}>
                          <FileCheck className="mr-2 h-4 w-4" /> {t("importPolicy")}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setProcessToDelete(process)}
                        className="text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" /> {t("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            
            {salesProcesses.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <ArrowUpRight className="h-8 w-8 mb-2" />
                    <p>{t("noSalesProcesses")}</p>
                    <p className="text-sm">{t("createYourFirstProcess")}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* The dialog components would be rendered here. They'll be implemented in the future. */}
      {/* 
      <SalesProcessDetailsDialog 
        process={processToView} 
        open={!!processToView} 
        onOpenChange={(open) => !open && setProcessToView(null)}
      />
      
      <EditSalesProcessDialog 
        process={processToEdit}
        open={!!processToEdit}
        onOpenChange={(open) => !open && setProcessToEdit(null)}
        onProcessUpdated={onRefresh}
      />
      
      <DeleteSalesProcessDialog
        process={processToDelete}
        open={!!processToDelete}
        onOpenChange={(open) => !open && setProcessToDelete(null)}
        onProcessDeleted={onRefresh}
      />
      
      <ImportPolicyFromSalesDialog
        process={processToImport}
        open={!!processToImport}
        onOpenChange={(open) => !open && setProcessToImport(null)}
      />
      */}
    </>
  );
};

export default SalesProcessesTable;
