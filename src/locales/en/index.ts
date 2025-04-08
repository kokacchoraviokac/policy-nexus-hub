import auth from "./auth.json";
import claims from "./claims.json";
import codebook from "./codebook.json";
import common from "./common.json";
import dashboard from "./dashboard.json";
import documents from "./documents.json";
import errors from "./errors.json";
import finances from "./finances.json";
import layout from "./layout.json";
import modules from "./modules.json";
import settings from "./settings.json";
import agent from "./agent.json";
import policies from "./policies";
import reports from "./reports.json";

const en = {
  ...auth,
  ...claims,
  ...codebook,
  ...common,
  ...dashboard,
  ...documents,
  ...errors,
  ...finances,
  ...layout,
  ...modules,
  ...policies,
  ...settings,
  ...agent,
  ...reports
};

export default en;
