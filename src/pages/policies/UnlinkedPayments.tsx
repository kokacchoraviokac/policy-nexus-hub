
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, RefreshCw, Link } from "lucide-react";

const UnlinkedPayments = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [insuranceCompany, setInsuranceCompany] = useState("all");
  
  // This would be fetched from an API in a real implementation
  const mockUnlinkedPayments = [
    {
      id: "1",
      insuranceCompany: "Allianz",
      policyholder: "John Doe",
      paymentRef: "ALZ-2023-001",
      baseAmount: 1200,
      commissionPct: 10,
      paymentAmount: 1320,
      paymentDate: "2023-10-15",
      invoiceRef: "INV-2023-001"
    },
    {
      id: "2",
      insuranceCompany: "AXA",
      policyholder: "Jane Smith",
      paymentRef: "AXA-2023-042",
      baseAmount: 850,
      commissionPct: 12,
      paymentAmount: 952,
      paymentDate: "2023-10-20",
      invoiceRef: "INV-2023-042"
    }
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCompanyChange = (value: string) => {
    setInsuranceCompany(value);
  };

  const handleLinkPayment = (paymentId: string) => {
    console.log("Linking payment:", paymentId);
    // This would open a dialog to link the payment to a policy
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("unlinkedPayments")}</h1>
        <p className="text-muted-foreground">
          {t("unlinkedPaymentsDescription")}
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("manageUnlinkedPayments")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchPayments")}
                className="pl-9"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <Select
              value={insuranceCompany}
              onValueChange={handleCompanyChange}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t("filterByCompany")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allCompanies")}</SelectItem>
                <SelectItem value="allianz">Allianz</SelectItem>
                <SelectItem value="axa">AXA</SelectItem>
                <SelectItem value="generali">Generali</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" title={t("refreshList")}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("insuranceCompany")}</TableHead>
                <TableHead>{t("policyholder")}</TableHead>
                <TableHead>{t("paymentReference")}</TableHead>
                <TableHead className="text-right">{t("baseAmount")}</TableHead>
                <TableHead className="text-right">{t("commission")}</TableHead>
                <TableHead className="text-right">{t("paymentAmount")}</TableHead>
                <TableHead>{t("paymentDate")}</TableHead>
                <TableHead>{t("invoiceReference")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUnlinkedPayments.length > 0 ? (
                mockUnlinkedPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.insuranceCompany}</TableCell>
                    <TableCell>{payment.policyholder}</TableCell>
                    <TableCell>{payment.paymentRef}</TableCell>
                    <TableCell className="text-right">{payment.baseAmount}</TableCell>
                    <TableCell className="text-right">{payment.commissionPct}%</TableCell>
                    <TableCell className="text-right">{payment.paymentAmount}</TableCell>
                    <TableCell>{payment.paymentDate}</TableCell>
                    <TableCell>{payment.invoiceRef}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleLinkPayment(payment.id)}
                      >
                        <Link className="h-4 w-4 mr-1" />
                        {t("linkPayment")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    {t("noPaymentsFound")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnlinkedPayments;
