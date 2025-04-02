import { SalesProcessStage, SalesProcessStatus } from "@/types/salesProcess";

/**
 * Configuration for allowed stage transitions in sales processes
 * Maps current stage to allowed next stages
 */
export const stageTransitions: Record<SalesProcessStage, SalesProcessStage[]> = {
  "quote": ["authorization"],
  "authorization": ["proposal"],
  "proposal": ["signed"],
  "signed": ["concluded"],
  "concluded": []
};

/**
 * Defines requirements that must be met before a stage transition
 */
export type TransitionRequirement = {
  check: (data: any) => boolean;
  errorMessage: string;
};

/**
 * Configuration for stage transition requirements
 * Maps stage transition to requirements that must be met
 */
export const transitionRequirements: Record<string, TransitionRequirement[]> = {
  "quote_authorization": [
    {
      check: (data: { selectedQuoteId: string | null }) => !!data.selectedQuoteId,
      errorMessage: "noSelectedQuote"
    }
  ]
};

/**
 * Determines if a stage can transition to a target stage
 */
export const canTransitionTo = (currentStage: SalesProcessStage, targetStage: SalesProcessStage): boolean => {
  return stageTransitions[currentStage].includes(targetStage);
};

/**
 * Gets the next stage in the standard workflow
 */
export const getNextStage = (currentStage: SalesProcessStage): SalesProcessStage | null => {
  const nextStages = stageTransitions[currentStage];
  return nextStages.length > 0 ? nextStages[0] : null;
};

/**
 * Determines if the stage is the final one
 */
export const isFinalStage = (stage: SalesProcessStage): boolean => {
  return stage === "concluded";
};

/**
 * Determines if a process is ready for policy import
 */
export const isReadyForPolicyImport = (
  stage: SalesProcessStage, 
  status: SalesProcessStatus
): boolean => {
  return stage === "concluded" && status === "completed";
};

/**
 * Check requirements for transitioning between stages
 * @returns Object with validation result and any error message
 */
export const validateTransition = (
  fromStage: SalesProcessStage, 
  toStage: SalesProcessStage,
  data: any
): { valid: boolean; errorMessage?: string } => {
  // Check if transition is allowed in configuration
  if (!canTransitionTo(fromStage, toStage)) {
    return { valid: false, errorMessage: "invalidStageTransition" };
  }
  
  // Check if there are specific requirements for this transition
  const transitionKey = `${fromStage}_${toStage}`;
  const requirements = transitionRequirements[transitionKey] || [];
  
  // Validate all requirements
  for (const requirement of requirements) {
    if (!requirement.check(data)) {
      return { valid: false, errorMessage: requirement.errorMessage };
    }
  }
  
  return { valid: true };
};

/**
 * Determine status changes that should occur when moving to a new stage
 */
export const getStatusForStageTransition = (
  currentStage: SalesProcessStage,
  targetStage: SalesProcessStage,
  currentStatus: SalesProcessStatus
): SalesProcessStatus => {
  // If moving to final stage, update status to completed
  if (targetStage === "concluded") {
    return "completed";
  }
  
  // Otherwise maintain current status
  return currentStatus;
};
