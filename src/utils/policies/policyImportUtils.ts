import { parse } from 'csv-parse';

// Define a type for the CSV rows
interface CsvRow {
  policy_number: string;
  policy_type: string;
  insurer_id: string;
  insurer_name: string;
  product_id: string;
  product_name: string;
  client_id: string;
  policyholder_name: string;
  insured_name: string;
  start_date: string;
  expiry_date: string;
  premium: string;
  currency: string;
  payment_frequency: string;
  commission_type: string;
  commission_percentage: string;
  notes: string;
}

// To handle validation errors by row
interface ValidationErrors {
  [key: number]: string[];
}

// Helper function to validate date format
const isValidDate = (dateString: string): boolean => {
  const pattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!pattern.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// Helper function to validate number format
const isValidNumber = (numberString: string): boolean => {
  return !isNaN(Number(numberString));
};

// Helper function to validate currency
const isValidCurrency = (currencyString: string): boolean => {
  const validCurrencies = ['EUR', 'USD', 'RSD', 'GBP', 'CHF'];
  return validCurrencies.includes(currencyString);
};

// Helper function to validate payment frequency
const isValidPaymentFrequency = (paymentFrequency: string): boolean => {
  const validFrequencies = ['monthly', 'quarterly', 'biannually', 'annually', 'singlePayment'];
  return validFrequencies.includes(paymentFrequency);
};

// Helper function to validate commission type
const isValidCommissionType = (commissionType: string): boolean => {
  const validCommissionTypes = ['automatic', 'manual', 'none'];
  return validCommissionTypes.includes(commissionType);
};

// Fix duplicate property in policy creation
export const parseCsv = async (file: File) => {
  return new Promise<{ policies: CsvRow[]; errors: ValidationErrors }>((resolve, reject) => {
    const errors: ValidationErrors = {};
    const policies: CsvRow[] = [];
    let row_number = 0;

    file.text().then(text => {
      parse(text, {
        header: true,
        skip_empty_lines: true,
      })
      .on("data", function (row: CsvRow) {
        row_number++;
        const rowErrors: string[] = [];

        // Validate each field
        if (!row.policy_number) {
          rowErrors.push("Policy number is required");
        }
        if (!row.policy_type) {
          rowErrors.push("Policy type is required");
        }
        if (!row.insurer_name) {
          rowErrors.push("Insurer name is required");
        }
        if (!row.policyholder_name) {
          rowErrors.push("Policyholder name is required");
        }
        if (!isValidDate(row.start_date)) {
          rowErrors.push("Invalid start date format. Use YYYY-MM-DD");
        }
        if (!isValidDate(row.expiry_date)) {
          rowErrors.push("Invalid expiry date format. Use YYYY-MM-DD");
        }
        if (!isValidNumber(row.premium)) {
          rowErrors.push("Invalid premium format. Use a number");
        }
        if (!isValidCurrency(row.currency)) {
          rowErrors.push("Invalid currency format. Use EUR, USD, RSD, GBP, or CHF");
        }
        if (row.payment_frequency && !isValidPaymentFrequency(row.payment_frequency)) {
          rowErrors.push("Invalid payment frequency format. Use monthly, quarterly, biannually, annually, or singlePayment");
        }
        if (row.commission_type && !isValidCommissionType(row.commission_type)) {
          rowErrors.push("Invalid commission type format. Use automatic, manual, or none");
        }
        if (row.commission_percentage && !isValidNumber(row.commission_percentage)) {
          rowErrors.push("Invalid commission percentage format. Use a number");
        }

        if (rowErrors.length > 0) {
          errors[row_number - 1] = rowErrors;
        }

        policies.push(row);
      })
      .on("end", () => {
        resolve({ policies, errors });
      })
      .on("error", (error: any) => {
        reject(error);
      });
    });
  });
};
