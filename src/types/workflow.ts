
export enum WorkflowStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled',
  // Adding missing status values
  READY = 'ready',
  REVIEW = 'review',
  COMPLETE = 'complete'
}
