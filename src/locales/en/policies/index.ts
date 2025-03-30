
import general from './general.json';
import workflow from './workflow.json';
import documents from './documents.json';
import addendums from './addendums.json';
import unlinkedPayments from './unlinkedPayments.json';
import importExport from './importExport.json';

// Merge all policy-related translations
const policyTranslations = {
  ...general,
  ...workflow,
  ...documents,
  ...addendums,
  ...unlinkedPayments,
  ...importExport
};

export default policyTranslations;
