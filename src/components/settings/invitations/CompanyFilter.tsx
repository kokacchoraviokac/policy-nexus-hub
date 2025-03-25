
import React from 'react';
import { Company } from '@/hooks/useCompanies';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CompanyFilterProps {
  companies: Company[];
  onValueChange: (value: string) => void;
}

const CompanyFilter: React.FC<CompanyFilterProps> = ({
  companies,
  onValueChange,
}) => {
  return (
    <div className="mb-4">
      <Select onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by company" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Companies</SelectItem>
          {companies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CompanyFilter;
