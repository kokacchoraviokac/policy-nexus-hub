
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";

// For now, we'll use a mock list of bank statements
const mockStatements = [
  {
    id: "1",
    bank_name: "UniCredit",
    account_number: "170-123456789-01",
    statement_date: "2023-12-15",
    status: "processed"
  },
  {
    id: "2",
    bank_name: "Raiffeisen",
    account_number: "265-987654321-10",
    statement_date: "2023-12-10",
    status: "confirmed"
  },
  {
    id: "3",
    bank_name: "Komercijalna",
    account_number: "205-111222333-20",
    statement_date: "2023-12-01",
    status: "in_progress"
  }
];

const BankStatements = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Function to handle statement selection
  const handleStatementClick = (statementId: string) => {
    navigate(`/finances/statements/${statementId}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t("bankStatements")}</h1>
        <div className="flex space-x-2">
          <Button onClick={() => navigate("/finances")} variant="outline">
            {t("backToFinances")}
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("uploadStatement")}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("statementsList")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStatements.map((statement) => (
              <div 
                key={statement.id}
                className="flex items-center justify-between p-4 border rounded-md cursor-pointer hover:bg-muted/50"
                onClick={() => handleStatementClick(statement.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{statement.bank_name}</h3>
                    <p className="text-sm text-muted-foreground">{statement.account_number}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-right mr-4">
                    <p className="text-sm font-medium">{statement.statement_date}</p>
                    <p className="text-xs text-muted-foreground">{t(statement.status)}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    {t("view")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankStatements;
