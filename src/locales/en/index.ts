
import common from './common.json';
import auth from './auth.json';
import policies from './policies/index';
import dashboard from './dashboard.json';
import clients from './codebook.json'; // Changed from clients.json to codebook.json as clients.json doesn't exist
import codebook from './codebook.json';
import claims from './claims.json';
import sales from './sales.json';
import settings from './settings.json';
import profile from './auth.json'; // Changed from profile.json to auth.json as profile.json doesn't exist
import documents from './documents.json';
import modules from './modules.json';
import finances from './finances.json';
import reports from './reports.json';
import agent from './agent.json';
import quotes from './quotes.json';

const translations = {
  common,
  auth,
  policies,
  dashboard,
  clients,
  codebook,
  navigation: {}, // navigation.json doesn't exist, using empty object
  claims,
  sales,
  settings,
  profile,
  documents,
  modules,
  finances,
  reports,
  agent,
  quotes
};

export default translations;
