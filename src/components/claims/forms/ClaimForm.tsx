
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import ClaimDetailsForm from './ClaimDetailsForm';
import PolicySearchDialog from '@/components/policies/search/PolicySearchDialog';

const ClaimForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [policySearchOpen, setPolicySearchOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Default values for a new claim
  const defaultValues = {
    policy_id: '',
    claim_number: '',
    damage_description: '',
    incident_date: '',
    claimed_amount: 0,
    deductible: undefined,
    status: 'in_processing' as const,
    notes: ''
  };
  
  const handleSelectPolicy = (policy: any) => {
    setSelectedPolicy(policy);
    setPolicySearchOpen(false);
  };
  
  const handleSubmit = (values: any) => {
    console.log("Submit claim with values:", values);
    // Submission would be implemented here
    navigate('/claims');
  };
  
  const handleCancel = () => {
    navigate('/claims');
  };
  
  return (
    <>
      <ClaimDetailsForm
        defaultValues={defaultValues}
        selectedPolicy={selectedPolicy}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        isFormDisabled={!selectedPolicy}
        openPolicySearch={() => setPolicySearchOpen(true)}
      />
      
      <PolicySearchDialog
        open={policySearchOpen}
        onOpenChange={setPolicySearchOpen}
        onSelect={handleSelectPolicy}
      />
    </>
  );
};

export default ClaimForm;
