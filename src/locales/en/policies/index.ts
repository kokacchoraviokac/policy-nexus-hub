
import general from './general.json';
import importExport from './importExport.json';
import documents from './documents.json';
import workflow from './workflow.json';
import addendums from './addendums.json';
import unlinkedPayments from './unlinkedPayments.json';

// Merge all policy-related translations
const policyTranslations = {
  ...general,
  ...importExport,
  ...documents,
  ...workflow,
  ...addendums,
  ...unlinkedPayments
};

export default policyTranslations;
