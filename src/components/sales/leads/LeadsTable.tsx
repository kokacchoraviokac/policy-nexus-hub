
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Edit, MoreHorizontal, Eye, Trash, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DataTable, { Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import LeadDetailsDialog from "./LeadDetailsDialog";
import EditLeadDialog from "./EditLeadDialog";
import DeleteLeadDialog from "./DeleteLeadDialog";
import ConvertLeadDialog from "./ConvertLeadDialog";

// Define lead type
export interface Lead {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  status: 'new' | 'qualified' | 'converted' | 'lost';
  source?: string;
  created_at: string;
  responsible_person?: string;
  notes?: string;
}

interface LeadsTableProps {
  leads: Lead[];
  onRefresh: () => void;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, onRefresh }) => {
  const { t } = useLanguage();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);

  // Lead status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{t("newLeads")}</Badge>;
      case 'qualified':
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">{t("qualifiedLeads")}</Badge>;
      case 'converted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{t("convertedLeads")}</Badge>;
      case 'lost':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">{t("lostLeads")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Handle view lead
  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setViewOpen(true);
  };

  // Handle edit lead
  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setEditOpen(true);
  };

  // Handle delete lead
  const handleDeleteLead = (lead: Lead) => {
    setSelectedLead(lead);
    setDeleteOpen(true);
  };

  // Handle convert lead
  const handleConvertLead = (lead: Lead) => {
    setSelectedLead(lead);
    setConvertOpen(true);
  };

  // Handle lead update
  const handleLeadUpdated = () => {
    onRefresh();
    toast.success(t("leadUpdated"), {
      description: t("leadUpdatedDescription")
    });
  };

  // Handle lead deletion
  const handleLeadDeleted = () => {
    onRefresh();
    toast.success(t("leadDeleted"), {
      description: t("leadDeletedDescription")
    });
  };

  // Handle lead conversion
  const handleLeadConverted = () => {
    onRefresh();
    toast.success(t("leadConverted"), {
      description: t("leadConvertedDescription")
    });
  };

  // Define columns
  const columns: Column<Lead>[] = [
    {
      header: t("name"),
      accessorKey: "name",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.name}</span>
          {row.company && <span className="text-sm text-muted-foreground">{row.company}</span>}
        </div>
      ),
      sortable: true,
    },
    {
      header: t("contact"),
      accessorKey: "email",
      cell: (row) => (
        <div className="flex flex-col">
          <span>{row.email}</span>
          {row.phone && <span className="text-sm text-muted-foreground">{row.phone}</span>}
        </div>
      ),
    },
    {
      header: t("status"),
      accessorKey: "status",
      cell: (row) => getStatusBadge(row.status),
      sortable: true,
    },
    {
      header: t("source"),
      accessorKey: "source",
    },
    {
      header: t("createdAt"),
      accessorKey: "created_at",
      cell: (row) => format(new Date(row.created_at), "PPP"),
      sortable: true,
    },
    {
      header: t("responsiblePerson"),
      accessorKey: "responsible_person",
    },
    {
      header: t("actions"),
      accessorKey: "id",
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{t("openMenu")}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleViewLead(row)}>
              <Eye className="mr-2 h-4 w-4" />
              {t("viewDetails")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditLead(row)}>
              <Edit className="mr-2 h-4 w-4" />
              {t("editLead")}
            </DropdownMenuItem>
            {row.status !== 'converted' && (
              <DropdownMenuItem onClick={() => handleConvertLead(row)}>
                <UserPlus className="mr-2 h-4 w-4" />
                {t("convertToSalesProcess")}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleDeleteLead(row)}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              {t("deleteLead")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={leads}
        columns={columns}
        emptyState={{
          title: t("noLeadsFound"),
          description: t("createYourFirstLead"),
        }}
      />

      {/* Lead Dialogs */}
      {selectedLead && (
        <>
          <LeadDetailsDialog
            lead={selectedLead}
            open={viewOpen}
            onOpenChange={setViewOpen}
          />
          
          <EditLeadDialog
            lead={selectedLead}
            open={editOpen}
            onOpenChange={setEditOpen}
            onLeadUpdated={handleLeadUpdated}
          />
          
          <DeleteLeadDialog
            lead={selectedLead}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            onLeadDeleted={handleLeadDeleted}
          />
          
          <ConvertLeadDialog
            lead={selectedLead}
            open={convertOpen}
            onOpenChange={setConvertOpen}
            onLeadConverted={handleLeadConverted}
          />
        </>
      )}
    </>
  );
};

export default LeadsTable;
