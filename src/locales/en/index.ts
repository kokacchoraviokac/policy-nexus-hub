
// Import all translation files
import auth from './auth.json';
import claims from './claims.json';
import codebook from './codebook.json';
import common from './common.json';
import dashboard from './dashboard.json';
import documents from './documents.json';
import errors from './errors.json';
import finances from './finances.json';
import layout from './layout.json';
import modules from './modules.json';
import settings from './settings.json';
import sales from './sales.json';

// Import policies translations
import * as policies from './policies';

// Merge all translations
const translations = {
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
  ...policies.default,
  ...settings,
  ...sales
};

export default translations;
