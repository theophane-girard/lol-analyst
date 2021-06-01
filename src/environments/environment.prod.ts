import { CREDENTIALS } from "src/config/credentials";

export const environment = {
  production: true,
  matchAmount: 20,
  ...CREDENTIALS,
  riotBaseUrl: 'https://euw1.api.riotgames.com'
};
