
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { BankStatement } from "@/types/finances";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Eye,
  FileCheck,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { UseMutateFunction } from "@tanstack/react-query";

interface BankStatementsListProps {
  statements: BankStatement[];
  isLoading: boolean;
  onStatementClick: (statementId: string) => void;
  onProcessStatement: UseMutateFunction<{ statementId: string }, Error, string, unknown>;
  onConfirmStatement: UseMutateFunction<{ statementId: string }, Error, string, unknown>;
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
  const { t } = useLanguage();
  
  const handleDownload = (statement: BankStatement) => {
    // Placeholder for download functionality
    alert(`Download statement ${statement.id}`);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">{t(status)}</Badge>;
      case "processed":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">{t(status)}</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">{t(status)}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (statements.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t("noStatementsFound")}</p>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("date")}</TableHead>
          <TableHead>{t("bank")}</TableHead>
          <TableHead>{t("account")}</TableHead>
          <TableHead>{t("status")}</TableHead>
          <TableHead className="text-right">{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {statements.map((statement) => (
          <TableRow key={statement.id}>
            <TableCell>
              {new Date(statement.statement_date).toLocaleDateString()}
            </TableCell>
            <TableCell>{statement.bank_name}</TableCell>
            <TableCell>{statement.account_number}</TableCell>
            <TableCell>{getStatusBadge(statement.status)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(statement)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                {statement.status === "in_progress" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onProcessStatement(statement.id)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCheck className="h-4 w-4" />}
                  </Button>
                )}
                {statement.status === "processed" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onConfirmStatement(statement.id)}
                    disabled={isConfirming}
                  >
                    {isConfirming ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCheck className="h-4 w-4" />}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatementClick(statement.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BankStatementsList;
