
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Building, PieChart, ListFilter } from "lucide-react";
import { BankStatement } from "@/types/finances";

interface BankStatementDetailsCardProps {
  statement: BankStatement;
  transactionCount: number;
}

const BankStatementDetailsCard: React.FC<BankStatementDetailsCardProps> = ({
  statement,
  transactionCount,
}) => {
  const { t, formatDate, formatCurrency } = useLanguage();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>{t("statementDetails")}</CardTitle>
          <Badge variant={
            statement.status === 'in_progress' 
              ? 'outline' 
              : statement.status === 'processed' 
                ? 'secondary' 
                : 'default'
          }>
            {t(statement.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center text-muted-foreground text-sm">
              <Building className="mr-1 h-4 w-4" />
              {t("bank")}
            </div>
            <div className="font-medium">{statement.bank_name}</div>
            <div className="text-sm text-muted-foreground">{statement.account_number}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center text-muted-foreground text-sm">
              <Calendar className="mr-1 h-4 w-4" />
              {t("statementDate")}
            </div>
            <div className="font-medium">{formatDate(statement.statement_date)}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center text-muted-foreground text-sm">
              <ListFilter className="mr-1 h-4 w-4" />
              {t("transactions")}
            </div>
            <div className="font-medium">{transactionCount}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pt-4 border-t">
          <div className="space-y-1">
            <div className="flex items-center text-muted-foreground text-sm">
              <PieChart className="mr-1 h-4 w-4" />
              {t("balances")}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-sm text-muted-foreground">{t("startingBalance")}</div>
                <div className="font-medium">{formatCurrency(statement.starting_balance)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t("endingBalance")}</div>
                <div className="font-medium">{formatCurrency(statement.ending_balance)}</div>
              </div>
            </div>
          </div>
          
          {statement.processed_by && statement.processed_at && (
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">{t("processedInfo")}</div>
              <div className="font-medium">{formatDate(statement.processed_at)}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BankStatementDetailsCard;
