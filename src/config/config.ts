export const CONFIG: any = {
    apiUrl: '/lol',
    apiUrlMatchesByPuuidPrefix: '/match/v5/matches/by-puuid/',
    apiUrlMatchesByPuuidSuffix: '/ids',
    apiUrlMatchesByAccountId: '/match/v4/matchlists/by-account/',
    apiUrlMatchesById: '/match/v4/matches/',
    apiUrlGetSummoner: '/summoner/v4/summoners/by-name/',
    matchAmount: 4,
    matchStartIndex: 0,
    win: {
        'Win': 'V',
        'Fail': 'D'
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
    locale: 'fr-FR'
}