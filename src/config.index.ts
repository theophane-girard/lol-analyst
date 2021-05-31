import {writeFile} from 'fs';

import {name, version} from '../package.json';

const targetPath = './src/environments/environment.prod.ts';

const envConfigFile = `export const environment = {
    production: true,
    firebase: {
      apiKey: '${process.env.RIOT_API_KEY}'
    },
    CREDENTIALS: {
      summonerName: '${process.env.SUMMONER_NAME}'
    }
};
`;

writeFile(targetPath, envConfigFile, 'utf8', (err) => {
  if (err) {
    return console.log(err);
  }
});