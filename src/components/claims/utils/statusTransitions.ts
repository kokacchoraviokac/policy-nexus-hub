
// Define allowed status transitions for claims
// This controls what statuses are available when updating a claim

type StatusTransitionsMap = Record<string, string[]>;

export const statusTransitions: StatusTransitionsMap = {
  "in processing": ["reported", "accepted", "rejected"],
  "reported": ["in processing", "accepted", "rejected", "appealed"],
  "accepted": ["partially accepted", "paid", "appealed", "rejected"],
  "rejected": ["in processing", "appealed", "accepted"],
  "appealed": ["accepted", "rejected", "in processing"],
  "partially accepted": ["accepted", "paid", "appealed"],
  "paid": ["closed"],
  "withdrawn": ["closed"],
  "closed": []
};

export const getAllowedStatusTransitions = (currentStatus: string): string[] => {
  // Always include the current status as an option
  const availableStatuses = [currentStatus];
  
  // Add allowed transitions if they exist
  if (statusTransitions[currentStatus]) {
    availableStatuses.push(...statusTransitions[currentStatus]);
  }
  
  return availableStatuses;
};
