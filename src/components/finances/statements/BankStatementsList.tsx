
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
import { Eye, FileText, CheckCircle, Loader2 } from "lucide-react";
import { BankStatement } from "@/types/finances";

interface BankStatementsListProps {
  statements: BankStatement[];
  isLoading: boolean;
  onViewStatement: (statementId: string) => void;
  onProcessStatement: (statementId: string) => void;
  onConfirmStatement: (statementId: string) => void;
  isProcessing: boolean;
  isConfirming: boolean;
}

const getBadgeVariant = (status: string) => {
  switch (status) {
    case 'in_progress':
      return 'secondary';
    case 'processed':
      return 'outline';
    case 'confirmed':
      return 'default';
    default:
      return 'outline';
  }
};

const BankStatementsList: React.FC<BankStatementsListProps> = ({
  statements,
  isLoading,
  onViewStatement,
  onProcessStatement,
  onConfirmStatement,
  isProcessing,
  isConfirming
}) => {
  const { t, formatDate, formatCurrency } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!statements || statements.length === 0) {
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
            <TableHead>{t("bankName")}</TableHead>
            <TableHead>{t("accountNumber")}</TableHead>
            <TableHead>{t("statementDate")}</TableHead>
            <TableHead>{t("balance")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statements.map((statement) => (
            <TableRow key={statement.id}>
              <TableCell className="font-medium">{statement.bank_name}</TableCell>
              <TableCell>{statement.account_number}</TableCell>
              <TableCell>{formatDate(statement.statement_date)}</TableCell>
              <TableCell>{formatCurrency(statement.ending_balance)}</TableCell>
              <TableCell>
                <Badge variant={getBadgeVariant(statement.status)}>
                  {t(statement.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewStatement(statement.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  {statement.status === 'in_progress' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onProcessStatement(statement.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {t("process")}
                    </Button>
                  )}
                  
                  {statement.status === 'processed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onConfirmStatement(statement.id)}
                      disabled={isConfirming}
                    >
                      {isConfirming ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
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
