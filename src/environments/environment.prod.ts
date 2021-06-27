import { CREDENTIALS } from "src/config/credentials";

export const environment = {
  production: true,
  matchAmount: 1,
  ...CREDENTIALS,
  riotBaseUrl: 'https://theophane-girard.site/inter-detector-api'
};
