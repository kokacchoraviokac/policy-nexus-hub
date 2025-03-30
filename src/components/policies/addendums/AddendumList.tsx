
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash } from "lucide-react";
import { PolicyAddendum } from "@/types/policies";

export interface AddendumListProps {
  searchTerm?: string;
  statusFilter?: string;
  addendums?: PolicyAddendum[];
  policyNumber?: string;
  onRefresh?: () => void;
}

const AddendumList: React.FC<AddendumListProps> = ({ 
  searchTerm = "", 
  statusFilter = "all",
  addendums = [],
  policyNumber,
  onRefresh
}) => {
  const { t, formatDate, formatCurrency } = useLanguage();
  
  // Use provided addendums or fall back to mock data if none provided
  const addendumsToShow = addendums.length > 0 ? addendums : [
    {
      id: "1",
      policy_id: "p1",
      addendum_number: "ADD-001",
      effective_date: new Date().toISOString(),
      description: "Premium adjustment",
      premium_adjustment: 100,
      lien_status: false,
      status: "active",
      workflow_status: "complete",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      company_id: "c1"
    }
  ];
  
  const filteredAddendums = addendumsToShow.filter(addendum => {
    const matchesSearch = !searchTerm || 
      addendum.addendum_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      addendum.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || addendum.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("addendumNumber")}</TableHead>
            <TableHead>{t("effectiveDate")}</TableHead>
            <TableHead>{t("description")}</TableHead>
            <TableHead>{t("premiumAdjustment")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAddendums.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                {t("noAddendumsFound")}
              </TableCell>
            </TableRow>
          ) : (
            filteredAddendums.map((addendum) => (
              <TableRow key={addendum.id}>
                <TableCell className="font-medium">{addendum.addendum_number}</TableCell>
                <TableCell>{formatDate(addendum.effective_date)}</TableCell>
                <TableCell>{addendum.description}</TableCell>
                <TableCell>
                  {addendum.premium_adjustment ? 
                    formatCurrency(addendum.premium_adjustment, "EUR") : 
                    "-"}
                </TableCell>
                <TableCell>
                  <Badge variant={addendum.status === "active" ? "default" : "secondary"}>
                    {t(addendum.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AddendumList;
