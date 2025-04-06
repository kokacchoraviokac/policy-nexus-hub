
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatDateToLocal } from '@/utils/dateUtils';
import { Filter, Search } from 'lucide-react';
import { Policy } from '@/types/policies';
import { LoadingState } from '@/components/ui/loading-state';

export interface PolicySearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (policy: Policy) => void;
}

const PolicySearchDialog: React.FC<PolicySearchDialogProps> = ({
  open,
  onOpenChange,
  onSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [policies, setPolicies] = useState<Policy[]>([]);

  // Mock policy search - replace with actual API call
  const handleSearch = () => {
    setIsLoading(true);
    
    // Simulate API call with mock data
    setTimeout(() => {
      const mockPolicies: Policy[] = [
        {
          id: '1',
          policy_number: 'POL-2023-001',
          insurer_name: 'ABC Insurance',
          policyholder_name: 'John Doe',
          start_date: '2023-01-01',
          expiry_date: '2024-01-01',
          premium: 1200,
          policy_type: 'Auto Insurance',
          status: 'active',
          workflow_status: 'complete',
          company_id: '1',
          created_at: '2022-12-15',
          updated_at: '2022-12-15',
          currency: 'USD',
          client_name: 'John Doe'
        },
        {
          id: '2',
          policy_number: 'POL-2023-002',
          insurer_name: 'XYZ Insurance',
          policyholder_name: 'Jane Smith',
          start_date: '2023-02-01',
          expiry_date: '2024-02-01',
          premium: 950,
          policy_type: 'Home Insurance',
          status: 'active',
          workflow_status: 'complete',
          company_id: '1',
          created_at: '2023-01-20',
          updated_at: '2023-01-20',
          currency: 'USD',
          client_name: 'Jane Smith'
        }
      ];
      
      setPolicies(mockPolicies.filter(policy => 
        policy.policy_number.includes(searchQuery) || 
        policy.client_name.toLowerCase().includes(searchQuery.toLowerCase())
      ));
      
      setIsLoading(false);
    }, 500);
  };

  const handleSelectPolicy = (policy: Policy) => {
    onSelect(policy);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Search Policies</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mb-4">
          <Input
            placeholder="Search by policy number or client name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        
        {isLoading ? (
          <LoadingState />
        ) : (
          <div className="border rounded-md">
            {policies.length === 0 ? (
              <div className="py-6 text-center text-muted-foreground">
                No policies found
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-2">Policy Number</th>
                    <th className="text-left p-2">Client</th>
                    <th className="text-left p-2">Insurer</th>
                    <th className="text-left p-2">Expiry Date</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {policies.map((policy) => (
                    <tr key={policy.id} className="border-t">
                      <td className="p-2">{policy.policy_number}</td>
                      <td className="p-2">{policy.client_name}</td>
                      <td className="p-2">{policy.insurer_name}</td>
                      <td className="p-2">{formatDateToLocal(policy.expiry_date)}</td>
                      <td className="p-2 text-right">
                        <Button size="sm" onClick={() => handleSelectPolicy(policy)}>
                          Select
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PolicySearchDialog;
