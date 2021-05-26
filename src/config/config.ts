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
    soloRankedLabel: 'RANKED_SOLO_5x5'
}