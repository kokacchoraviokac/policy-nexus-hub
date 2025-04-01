
/**
 * Feature flags management utility
 * 
 * This utility allows for enabling/disabling features dynamically
 * without requiring code changes in multiple locations.
 */

import { ENABLE_ENHANCED_EXTRACTION } from "./enhancedDocumentExtraction";

// Collection of feature flags
export interface FeatureFlags {
  enhancedDocumentExtraction: boolean;
  // Add more feature flags here as needed
}

// Get the current state of all feature flags
export const getFeatureFlags = (): FeatureFlags => {
  return {
    enhancedDocumentExtraction: ENABLE_ENHANCED_EXTRACTION,
    // Add more flags here as they're implemented
  };
};

// This would normally connect to a backend to update flags
// For now, it simulates updating the flag and requires a page refresh
export const toggleFeatureFlag = (
  featureName: keyof FeatureFlags,
  enabled: boolean
): void => {
  console.log(`Feature '${featureName}' would be set to ${enabled ? 'enabled' : 'disabled'}`);
  console.log("In a real implementation, this would update a configuration in your backend.");
  console.log("To enable the enhanced document extraction feature, change ENABLE_ENHANCED_EXTRACTION to true in src/utils/enhancedDocumentExtraction.ts");
};
