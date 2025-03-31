
// Import policy-related translations
import importExport from './importExport.json';
import workflow from './workflow.json';

// Merge all policy-related translations
const policies = {
  ...importExport,
  ...workflow,
  // Add other policy-related imports as they are created
};

export default policies;
