
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BankStatement } from "@/types/finances";

interface BankStatementDetailsCardProps {
  statement: BankStatement;
  transactionCount: number;
}

const BankStatementDetailsCard: React.FC<BankStatementDetailsCardProps> = ({
  statement,
  transactionCount
}) => {
  const { t, formatDate, formatCurrency } = useLanguage();
  
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "in_progress":
        return "secondary";
      case "processed":
        return "outline";
      default:
        return "default";
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>{t("statementDetails")}</CardTitle>
          <Badge variant={getBadgeVariant(statement.status)}>
            {t(statement.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("bankName")}</h4>
                <p className="font-medium">{statement.bank_name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("accountNumber")}</h4>
                <p className="font-medium">{statement.account_number}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("statementDate")}</h4>
                <p className="font-medium">{formatDate(statement.statement_date)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("documentUploadDate")}</h4>
                <p className="font-medium">{formatDate(statement.created_at)}</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("startingBalance")}</h4>
                <p className="font-medium">{formatCurrency(statement.starting_balance)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("endingBalance")}</h4>
                <p className="font-medium">{formatCurrency(statement.ending_balance)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("netChange")}</h4>
                <p className={`font-medium ${statement.ending_balance - statement.starting_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(statement.ending_balance - statement.starting_balance)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("transactionCount")}</h4>
                <p className="font-medium">{transactionCount}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankStatementDetailsCard;
