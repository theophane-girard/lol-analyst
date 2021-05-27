import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of, from, forkJoin } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';
import { CONFIG } from 'src/config/config';
import { CREDENTIALS } from 'src/config/credentials';
import { RiotGames } from 'src/types/riot-games/riot-games';
import { Match } from '../models/match';
import { Player } from '../models/player';
import { MatchesService } from '../services/matches.service';
import { environment } from "../../../environments/environment";
import { ChampionsService } from '../services/champions.service';
@Component({
  selector: 'app-multiple-search',
  templateUrl: './multiple-search.component.html',
  styleUrls: ['./multiple-search.component.scss']
})
export class MultipleSearchComponent implements OnInit {
  CONFIG = CONFIG
  form: FormGroup
  players: Player[] = []
  public formattedPlayers: any

  constructor(
    private formBuilder: FormBuilder,
    private matchService: MatchesService,
    public championsService: ChampionsService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      players: new FormControl(null, Validators.required)
    })
    this.form.controls.players.valueChanges.subscribe(players => this.loadPlayerRankedData(players))
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
      let matchesRequest$: Observable<any>[] = []
      let playerRequest$ = this.matchService.getSummoner(name).pipe(
        tap((summoner: RiotGames.Summoner.SummonerDto) => currentSummoner = Player.factory(summoner)),
        switchMap(() => this.matchService.getSummonerLeague(currentSummoner.id)),
        tap((league: RiotGames.League.LeagueDto[]) => currentSummoner.league = league),
        switchMap(() => of(currentSummoner)),
        switchMap(summoner => this.matchService.getLastMatchIdList(CONFIG.matchStartIndex, environment.matchAmount, summoner)),
        tap((matches: RiotGames.MatchList.MatchList) => currentMatches = matches.matches),
        switchMap((matches: any) => from(matches.matches)),
        map((match: RiotGames.MatchList.MatchReference) => matchesRequest$.push(this.matchService.getMatchById(match.gameId))),
        switchMap(() => forkJoin(matchesRequest$)),
        map((matches: RiotGames.Match.MatchDetail[]) => this.addToRankedData(matches, currentSummoner, currentMatches)))

        playerResquests.push(playerRequest$)
    });

    forkJoin(playerResquests).subscribe(() => this.formatPlayers())
  
    // Nutripax joined the lobby
    // Holcahust joined the lobby
  }
  getPlayerNames(players: string) : string[] {
        
    let res = players.replace(/( joined the lobby|\n)/g, ',').split(',').filter(n => n !== '')
    if (res.length !== 0) {
      return res
    }

    return []
  }

  addLeagueData(league: any, currentSummoner: any): Observable<any> {
    currentSummoner.league = league
    return from(currentSummoner)
  }

  addToRankedData(matches: RiotGames.Match.MatchDetail[], currentSummoner, currentMatches: RiotGames.MatchList.MatchReference[]): void {
    if (this.players.every(player => player.id !== currentSummoner.id)) {
      this.players.push(currentSummoner)
    }
    let player = this.players.find(p => p.id === currentSummoner.id)
    if (!player.matches) {
      player.matches = []
    }
    matches.map(match => {
      let m = Match.factory(match)
      let mappingMatch = currentMatches.find(pMatch => pMatch.gameId === match.gameId)
      m.role = mappingMatch.role
      m.champion = mappingMatch.champion
      m.lane = mappingMatch.lane
      player.matches.push(m)
    })

  }

  formatPlayers(): void {
    this.players = this.players.map((player: Player) => {
      player.winrate = Math.round((100 * player.getWins()) / (player.getWins() + player.getLosses()) * 10) / 10
      return player
    })
  }
}
