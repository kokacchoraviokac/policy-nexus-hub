
export interface FinancialTransaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  reference?: string;
}

export const calculateTotals = (transactions: FinancialTransaction[]) => {
  return transactions.reduce(
    (totals, transaction) => {
      if (transaction.type === "income") {
        totals.income += transaction.amount;
      } else {
        totals.expenses += transaction.amount;
      }
      totals.net = totals.income - totals.expenses;
      return totals;
    },
    { income: 0, expenses: 0, net: 0 }
  );
};
