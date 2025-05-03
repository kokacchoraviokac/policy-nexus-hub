
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
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Lead, LeadStatus } from "@/types/sales/leads";
import { format } from "date-fns";
import EditLeadDialog from "./EditLeadDialog";
import DeleteLeadDialog from "./DeleteLeadDialog";
import LeadDetailsDialog from "./LeadDetailsDialog";
import ConvertLeadDialog from "./ConvertLeadDialog";

// Define props for the LeadsTable component
interface LeadsTableProps {
  leads: Lead[];
  onRefresh: () => void;
}

// Status badge component
const StatusBadge = ({ status }: { status: LeadStatus }) => {
  const getVariant = () => {
    switch (status) {
      case "new": return "default";
      case "qualified": return "secondary";
      case "converted": return "success";
      case "lost": return "destructive";
      default: return "outline";
    }
  };
  
  const { t } = useLanguage();
  
  return <Badge variant={getVariant() as any}>{t(status)}</Badge>;
};

// Format the date for display
const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "MMM d, yyyy");
  } catch (e) {
    return dateString;
  }
};

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, onRefresh }) => {
  const { t } = useLanguage();
  const [leadToEdit, setLeadToEdit] = React.useState<Lead | null>(null);
  const [leadToView, setLeadToView] = React.useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = React.useState<Lead | null>(null);
  const [leadToConvert, setLeadToConvert] = React.useState<Lead | null>(null);
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("name")}</TableHead>
              <TableHead className="hidden md:table-cell">{t("company")}</TableHead>
              <TableHead className="hidden md:table-cell">{t("contact")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead className="hidden md:table-cell">{t("created")}</TableHead>
              <TableHead className="w-[80px]">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">
                  {lead.name}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {lead.company_name || "-"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {lead.email || lead.phone || "-"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={lead.status} />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(lead.created_at)}
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
                      <DropdownMenuLabel>{t("leadActions")}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setLeadToView(lead)}>
                        <ExternalLink className="mr-2 h-4 w-4" /> {t("viewDetails")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLeadToEdit(lead)}>
                        <Edit className="mr-2 h-4 w-4" /> {t("edit")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLeadToConvert(lead)}>
                        <UserCheck className="mr-2 h-4 w-4" /> {t("convertToSales")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setLeadToDelete(lead)}
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
      
      {leadToEdit && (
        <EditLeadDialog 
          lead={leadToEdit} 
          open={!!leadToEdit} 
          onOpenChange={(open) => !open && setLeadToEdit(null)}
          onLeadUpdated={onRefresh}
        />
      )}
      
      {leadToView && (
        <LeadDetailsDialog
          lead={leadToView}
          open={!!leadToView}
          onOpenChange={(open) => !open && setLeadToView(null)}
        />
      )}
      
      {leadToDelete && (
        <DeleteLeadDialog
          lead={leadToDelete}
          open={!!leadToDelete}
          onOpenChange={(open) => !open && setLeadToDelete(null)}
          onLeadDeleted={onRefresh}
        />
      )}
      
      {leadToConvert && (
        <ConvertLeadDialog
          lead={leadToConvert}
          open={!!leadToConvert}
          onOpenChange={(open) => !open && setLeadToConvert(null)}
          onLeadConverted={onRefresh}
        />
      )}
    </>
  );
};

export default LeadsTable;
