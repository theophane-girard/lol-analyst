import { Component, OnInit } from '@angular/core';
import { MatchesService } from '../services/matches.service';
import { MatchToCSV } from '../models/match-to-csv';
import { CONFIG } from '../../../config/config';
import { formatDate, registerLocaleData} from "@angular/common";
import { CREDENTIALS } from '../../../config/credentials';
import localeFr from '@angular/common/locales/fr';
import { RiotGames } from '../../../types/riot-games/riot-games';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of, from, forkJoin } from 'rxjs';
import { concatMap, map, switchMap, tap } from 'rxjs/operators';
import { Player } from '../models/player';
import { Match } from '../models/match';

registerLocaleData(localeFr);

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss']
})
export class MatchListComponent implements OnInit {
  CREDENTIALS = CREDENTIALS
  matches: RiotGames.Match.MatchDetail[] = []
  matchesToCSV: MatchToCSV[] = []
  form: FormGroup
  players: Player[] = []
  public formattedPlayers: any

  constructor(
    private matchService: MatchesService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      players: new FormControl(null, Validators.required)
    })
    this.matchService.matches$.subscribe(matches => this.generateCSVData(matches))
    this.form.controls.players.valueChanges.subscribe(players => this.loadPlayerRankedData(players))
  }

  generateCSVData(matches: RiotGames.Match.MatchDetail[]): void {
    this.matches = matches
    this.matches.forEach(match => this.pushToMatchesCSV(match, matches));
    this.matchesToCSV = this.matchesToCSV.sort((a,b) => this.sortByDateAndGameNumber(a, b))
  }

  getGameNumber(
    match: RiotGames.Match.MatchDetail, 
    matches: RiotGames.Match.MatchDetail[], 
    date: Date
  ): number {
    let dayMatches = matches.filter(m => (new Date(m.gameCreation)).getDate() === date.getDate())
    dayMatches = dayMatches.sort((a, b) => a.gameCreation - b.gameCreation)
    return dayMatches.indexOf(match) + 1
  }

  formatWin(winner: string): string {
    return CONFIG.win[winner].label
  }

  sortByDateAndGameNumber(a, b) {
    let o1 = a.date;
    let o2 = b.date;
    let p1 = a.gameNumber;
    let p2 = b.gameNumber;

    if (o1 < o2) return -1;
    if (o1 > o2) return 1;
    if (p1 < p2) return -1;
    if (p1 > p2) return 1;
    return 0;
  }

  pushToMatchesCSV(match: RiotGames.Match.MatchDetail, matches: RiotGames.Match.MatchDetail[]) {
    let summonerToMap = match.participantIdentities.find(p => p.player.summonerName === CREDENTIALS.summonerName)
    let date = new Date(match.gameCreation)
    let summonerParticipantId: number = summonerToMap.participantId
    let participant = match.participants.find(p => p.participantId === summonerParticipantId)
    let win = match.teams.find(team => team.teamId === participant.teamId).win

    let matchToCSV: MatchToCSV = {
      date: formatDate(date, 'dd/MM/yyyy', CONFIG.locale),
      day: CONFIG.daysOfWeek[date.getDay()],
      hour: formatDate(date, 'HH:mm:00', CONFIG.locale),
      win: this.formatWin(win),
      gameNumber: this.getGameNumber(match, matches, date)
    }
    this.matchesToCSV.push(matchToCSV)
  }

  loadPlayerRankedData(players: string): void {
    let playerNames: string[] = this.getPlayerNames(players)
    if (playerNames.length === 0) {
      console.error('pas de joueur')
      return
    }
    let playerResquests: Observable<any>[] = []

    playerNames.filter(name => name.replace(/\s/g, '') !== CREDENTIALS.summonerName.replace(/\s/g, '')).forEach(name => {
      let currentSummoner: Player
      let currentMatches: any
      let playerRequest$ = this.matchService.getSummoner(name).pipe(
        tap((summoner: RiotGames.Summoner.SummonerDto) => currentSummoner = Player.factory(summoner)),
        switchMap(() => this.matchService.getSummonerLeague(currentSummoner.id)),
        tap((league: RiotGames.League.LeagueDto[]) => currentSummoner.league = league),
        switchMap(() => of(currentSummoner)),
        switchMap(summoner => this.matchService.getLastMatchIdList(CONFIG.matchStartIndex, CONFIG.matchAmount, summoner)),
        tap((matches: RiotGames.MatchList.MatchList) => currentMatches = matches.matches),
        switchMap((matches: any) => from(matches.matches)),
        concatMap((match: any) => this.matchService.getMatchById(match.gameId)),
        map((match: RiotGames.Match.MatchDetail) => this.addToRankedData(match, currentSummoner, currentMatches)))

        playerResquests.push(playerRequest$)
    });

    forkJoin(playerResquests).subscribe(() => this.formatPlayers())
  
    // Nutripax joined the lobby
    // Holcahust joined the lobby
  }
  getPlayerNames(players: string) : string[] {
        
    let res = players.replace(/ joined the lobby/g, '').split(',').filter(n => n !== '')
    if (res.length !== 0) {
      return res
    }
  
    res = players.replace(/ joined the lobby/g, '').split('\n').filter(n => n !== '')
    if (res.length !== 0) {
      return res
    }

    return []
  }

  addLeagueData(league: any, currentSummoner: any): Observable<any> {
    currentSummoner.league = league
    return from(currentSummoner)
  }

  addToRankedData(match: RiotGames.Match.MatchDetail, currentSummoner, currentMatches: RiotGames.MatchList.MatchReference[]): void {
    if (this.players.every(player => player.id !== currentSummoner.id)) {
      this.players.push(currentSummoner)
    }
    let player = this.players.find(p => p.id === currentSummoner.id)
    if (!player.matches) {
      player.matches = []
    }
    let m = Match.factory(match)
    let mappingMatch = currentMatches.find(pMatch => pMatch.gameId === match.gameId)
    m.role = mappingMatch.role
    m.champion = mappingMatch.champion
    m.lane = mappingMatch.lane
    player.matches.push(m)
  }

  formatPlayers(): void {
    this.players = this.players.map((player: Player) => {
      player.winrate = Math.round((100 * player.getWins()) / (player.getWins() + player.getLosses()) * 100) / 100     
      return player
    })
  }

}
