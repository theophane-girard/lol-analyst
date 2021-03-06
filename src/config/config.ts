export const CONFIG: any = {
  apiSummonersUrl: '/summoners',
  apiMatchToCsvUrl: '/summoners/matches/csv/',
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
    championsUrl: 'https://ddragon.leagueoflegends.com/cdn/11.11.1/data/en_US/champion.json',
    championsSplashArtUrl: 'https://ddragon.leagueoflegends.com/cdn/11.11.1/img/champion/',
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
    maxInterWinRate: 49,
    minQuiteInterWinRate: 49,
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
    maxRandomPlayerKda: 3.0,
    minQuiteCarryKda: 3.0,
    maxQuiteCarryKda: 3.5,
    minHyperCarryKda: 3.5,
    label: {
      inter: 'INTER',
      troll: 'TROLL',
      newAccount: 'New account',
      hyperCarry: 'HYPER CARRY',
      carry: 'Carry',
    },
    newAccountValue: 100,
    unrankedLabel: 'unranked'
}