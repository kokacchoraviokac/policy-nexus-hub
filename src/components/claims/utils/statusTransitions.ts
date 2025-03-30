
// Status transition utilities and constants for claim management

// Valid status transitions map defining allowed transitions between statuses
export const validStatusTransitions: Record<string, string[]> = {
  "in processing": ["reported", "rejected"],
  "reported": ["in processing", "accepted", "rejected", "partially accepted"],
  "accepted": ["in processing", "paid", "appealed"],
  "rejected": ["in processing", "appealed"],
  "appealed": ["in processing", "accepted", "rejected", "partially accepted"],
  "partially accepted": ["in processing", "paid", "appealed"],
  "paid": [],
  "withdrawn": []
};

// Get status info for display
export const getStatusInfo = (status: string) => {
  switch (status.toLowerCase()) {
    case 'in processing': 
      return { 
        description: 'claimStatusInProcessingDescription' 
      };
    case 'reported': 
      return { 
        description: 'claimStatusReportedDescription' 
      };
    case 'accepted': 
      return { 
        description: 'claimStatusAcceptedDescription' 
      };
    case 'rejected': 
      return { 
        description: 'claimStatusRejectedDescription' 
      };
    case 'appealed': 
      return { 
        description: 'claimStatusAppealedDescription' 
      };
    case 'partially accepted': 
      return { 
        description: 'claimStatusPartiallyAcceptedDescription' 
      };
    case 'paid': 
      return { 
        description: 'claimStatusPaidDescription' 
      };
    case 'withdrawn': 
      return { 
        description: 'claimStatusWithdrawnDescription' 
      };
    default: 
      return { 
        description: 'claimStatusDefaultDescription' 
      };
  }
};

// Check if the transition is valid
export const isValidStatusTransition = (
  currentStatus: string, 
  newStatus: string
): boolean => {
  if (newStatus === currentStatus) return true;
  return (validStatusTransitions[currentStatus] || []).includes(newStatus);
};
