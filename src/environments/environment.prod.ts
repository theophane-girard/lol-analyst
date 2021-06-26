import { CREDENTIALS } from "src/config/credentials";

export const environment = {
  production: true,
  matchAmount: 1,
  ...CREDENTIALS,
  riotBaseUrl: 'http://theophane-girard.site/inter-detector-api'
};
