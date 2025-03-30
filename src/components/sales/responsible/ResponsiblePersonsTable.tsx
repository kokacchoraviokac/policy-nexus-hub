
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for responsible persons assignments
const mockAssignments = [
  {
    id: "1",
    employee: { id: "1", name: "John Doe", role: "Sales Manager" },
    entity: { id: "1", name: "Acme Corporation", type: "Lead" },
    assignedDate: "2023-06-15T10:30:00",
    status: "active",
  },
  {
    id: "2",
    employee: { id: "2", name: "Jane Smith", role: "Account Executive" },
    entity: { id: "3", name: "Summit Partners", type: "Sales Process" },
    assignedDate: "2023-06-18T14:45:00",
    status: "active",
  },
  {
    id: "3",
    employee: { id: "3", name: "Mike Johnson", role: "Sales Representative" },
    entity: { id: "2", name: "Global Industries", type: "Lead" },
    assignedDate: "2023-06-20T09:15:00",
    status: "active",
  },
];

interface ResponsiblePersonsTableProps {
  onEdit?: (assignmentId: string) => void;
  onDelete?: (assignmentId: string) => void;
  onView?: (assignmentId: string) => void;
}

const ResponsiblePersonsTable: React.FC<ResponsiblePersonsTableProps> = ({
  onEdit,
  onDelete,
  onView,
}) => {
  const { t } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("employee")}</TableHead>
            <TableHead>{t("assignedTo")}</TableHead>
            <TableHead>{t("entityType")}</TableHead>
            <TableHead>{t("assignedDate")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockAssignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell className="font-medium">
                {assignment.employee.name}
              </TableCell>
              <TableCell>{assignment.entity.name}</TableCell>
              <TableCell>
                <Badge variant={assignment.entity.type === "Lead" ? "outline" : "secondary"}>
                  {assignment.entity.type}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(assignment.assignedDate)}</TableCell>
              <TableCell>
                <Badge variant="success">{t(assignment.status)}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onView && onView(assignment.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("viewDetails")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit && onEdit(assignment.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("editAssignment")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete && onDelete(assignment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("deleteAssignment")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResponsiblePersonsTable;
