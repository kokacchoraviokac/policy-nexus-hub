
import general from "./general.json";
import addendums from "./addendums.json";
import documents from "./documents.json";
import importExport from "./importExport.json";
import unlinkedPayments from "./unlinkedPayments.json";
import workflow from "./workflow.json";
import reports from "./reports.json";

export default {
  ...general,
  ...addendums,
  ...documents,
  ...importExport,
  ...unlinkedPayments,
  ...workflow,
  ...reports
};
