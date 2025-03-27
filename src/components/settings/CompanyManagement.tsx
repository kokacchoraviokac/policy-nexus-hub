
import React, { useState } from "react";
import { useCompanies, Company } from "@/hooks/useCompanies";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Edit, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const CompanyManagement: React.FC = () => {
  const { companies, loading, updateCompanySeats } = useCompanies();
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [newSeatsLimit, setNewSeatsLimit] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useLanguage();

  const handleEditSeats = (company: Company) => {
    setEditingCompany(company);
    setNewSeatsLimit(company.seatsLimit || 5);
    setIsDialogOpen(true);
  };

  const handleSaveSeats = async () => {
    if (editingCompany && newSeatsLimit >= 0) {
      await updateCompanySeats(editingCompany.id, newSeatsLimit);
      setIsDialogOpen(false);
      setEditingCompany(null);
    }
  };

  const calculateUsagePercentage = (used?: number, limit?: number): number => {
    if (typeof used !== 'number' || typeof limit !== 'number' || limit === 0) {
      return 0;
    }
    return Math.min(Math.round((used / limit) * 100), 100);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-primary" />
          <CardTitle>{t("companyManagement")}</CardTitle>
        </div>
        <CardDescription>
          {t("companyManagementDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("companyName")}</TableHead>
                <TableHead>{t("seatsUsage")}</TableHead>
                <TableHead>{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    {t("noCompaniesFound")}
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company) => {
                  const usagePercentage = calculateUsagePercentage(company.usedSeats, company.seatsLimit);
                  return (
                    <TableRow key={company.id}>
                      <TableCell>{company.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{company.usedSeats || 0} / {company.seatsLimit || 0} {t("seats")}</span>
                            <span>{usagePercentage}%</span>
                          </div>
                          <Progress value={usagePercentage} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditSeats(company)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          {t("editSeats")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("editSeatAllocation")}</DialogTitle>
              <DialogDescription>
                {t("setMaximumNumberOfUserAccounts")} {editingCompany?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="seatsLimit" className="block text-sm font-medium mb-1">
                    {t("seatsLimit")}
                  </label>
                  <Input
                    id="seatsLimit"
                    type="number"
                    min={editingCompany?.usedSeats || 0}
                    value={newSeatsLimit}
                    onChange={(e) => setNewSeatsLimit(parseInt(e.target.value) || 0)}
                  />
                  {editingCompany && editingCompany.usedSeats && newSeatsLimit < editingCompany.usedSeats && (
                    <p className="text-sm text-destructive mt-1">
                      {t("seatLimitCannotBeLessThanCurrentUsage")} ({editingCompany.usedSeats})
                    </p>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>{t("currentUsage")}: {editingCompany?.usedSeats || 0} {t("seats")}</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button 
                onClick={handleSaveSeats}
                disabled={editingCompany && editingCompany.usedSeats 
                  ? newSeatsLimit < editingCompany.usedSeats 
                  : false}
              >
                {t("saveChanges")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CompanyManagement;
