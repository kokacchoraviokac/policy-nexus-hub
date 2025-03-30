
import auth from './auth.json';
import common from './common.json';
import dashboard from './dashboard.json';
import layout from './layout.json';
import codebook from './codebook.json';
import modules from './modules.json';
import settings from './settings.json';
import errors from './errors.json';
import policies from './policies';

// Merge all translation objects
const translations = {
  ...common,
  ...auth,
  ...dashboard,
  ...layout,
  ...codebook,
  ...modules,
  ...settings,
  ...errors,
  ...policies
};

export default translations;
