export const CONFIG: any = {
    apiUrl: '/lol',
    apiUrlMatchesByPuuidPrefix: '/match/v5/matches/by-puuid/',
    apiUrlMatchesByPuuidSuffix: '/ids',
    apiUrlMatchesByAccountId: '/match/v4/matchlists/by-account/',
    apiUrlMatchesById: '/match/v4/matches/',
    apiUrlGetSummoner: '/summoner/v4/summoners/by-name/',
    apiUrlGetSummonerLeague: '/league/v4/entries/by-summoner/',
    matchStartIndex: 0,
    win: {
        'Win': {
          label: 'V',
          value: true
        },
        'Fail': {
          label: 'D',
          value: false
        }
    },
    daysOfWeek : {
        0: 7,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
    },
    locale: 'fr-FR',
    soloRankedLabel: 'RANKED_SOLO_5x5',
    championsUrl: 'http://ddragon.leagueoflegends.com/cdn/11.11.1/data/en_US/champion.json',
    championsSplashArtUrl: 'http://ddragon.leagueoflegends.com/cdn/11.11.1/img/champion/',
    championsSplashArtExtension: '.png',
    rankedPositionsExtension: '.png',
    rankedPositionLabel: 'Position_',
    rankedPositionTier: {
      'Platinum': 'Plat',
    },
    rankedPositionLane: {
      'Bottom': 'Bot',
    },
    rankedQueueId: 420,
    maxInterWinRate: 47,
    minQuiteInterWinRate: 47,
    maxQuiteInterWinRate: 50,
    minRandomPlayerWinRate: 50,
    maxRandomPlayerWinRate: 52,
    minQuiteCarryWinRate: 52,
    maxQuiteCarryWinRate: 55,
    minHyperCarryWinRate: 56,
  
    maxInterKda: 1,
    minQuiteInterKda: 1,
    maxQuiteInterKda: 1.2,
    minRandomPlayerKda: 1.2,
    maxRandomPlayerKda: 1.9,
    minQuiteCarryKda: 1.9,
    maxQuiteCarryKda: 3.5,
    minHyperCarryKda: 3.5,
    label: {
      inter: 'INTER',
      troller: 'Troll',
      newAccount: 'New account',
      hyperCarry: 'Hyper Carry',
    }
}