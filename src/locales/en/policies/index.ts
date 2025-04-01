
// Import policy-related translations
import importExport from './importExport.json';
import workflow from './workflow.json';
import addendums from './addendums.json';
import documents from './documents.json';
import general from './general.json';
import reports from './reports.json';
import unlinkedPayments from './unlinkedPayments.json';

// Merge all policy-related translations
const policies = {
  ...importExport,
  ...workflow,
  ...addendums,
  ...documents,
  ...general,
  ...reports,
  ...unlinkedPayments,
  // Add other policy-related imports as they are created
};

export default policies;
