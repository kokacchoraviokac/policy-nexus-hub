
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, CheckCircle2, PlayCircle } from "lucide-react";
import { BankStatement } from "@/types/finances";

interface BankStatementsListProps {
  statements: BankStatement[];
  isLoading: boolean;
  onStatementClick: (statementId: string) => void;
  onProcessStatement: (statementId: string) => void;
  onConfirmStatement: (statementId: string) => void;
  isProcessing: boolean;
  isConfirming: boolean;
}

const BankStatementsList: React.FC<BankStatementsListProps> = ({
  statements,
  isLoading,
  onStatementClick,
  onProcessStatement,
  onConfirmStatement,
  isProcessing,
  isConfirming,
}) => {
  const { t, formatDate, formatCurrency } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!statements.length) {
    return (
      <div className="text-center p-8 border rounded-lg bg-background">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">{t("noStatementsFound")}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {t("noStatementsDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("bank")}</TableHead>
            <TableHead>{t("accountNumber")}</TableHead>
            <TableHead>{t("date")}</TableHead>
            <TableHead>{t("startingBalance")}</TableHead>
            <TableHead>{t("endingBalance")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statements.map((statement) => (
            <TableRow key={statement.id}>
              <TableCell>{statement.bank_name}</TableCell>
              <TableCell>{statement.account_number}</TableCell>
              <TableCell>{formatDate(statement.statement_date)}</TableCell>
              <TableCell>{formatCurrency(statement.starting_balance)}</TableCell>
              <TableCell>{formatCurrency(statement.ending_balance)}</TableCell>
              <TableCell>
                <Badge 
                  variant={
                    statement.status === 'in_progress' 
                      ? 'outline' 
                      : statement.status === 'processed' 
                        ? 'secondary' 
                        : 'default'
                  }
                >
                  {t(statement.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onStatementClick(statement.id)}
                  >
                    {t("view")}
                  </Button>
                  
                  {statement.status === 'in_progress' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onProcessStatement(statement.id)}
                      disabled={isProcessing}
                    >
                      <PlayCircle className="h-4 w-4 mr-1" />
                      {t("process")}
                    </Button>
                  )}
                  
                  {statement.status === 'processed' && (
                    <Button 
                      size="sm" 
                      onClick={() => onConfirmStatement(statement.id)}
                      disabled={isConfirming}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      {t("confirm")}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BankStatementsList;
