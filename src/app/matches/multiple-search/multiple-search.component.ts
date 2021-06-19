import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of, from, forkJoin } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';
import { CONFIG } from 'src/config/config';
import { RiotGames } from 'src/types/riot-games/riot-games';
import { Match } from '../models/match';
import { Player } from '../models/player';
import { MatchesService } from '../services/matches.service';
import { environment } from "../../../environments/environment";
import { ChampionsService } from '../services/champions.service';
import { Label } from '../models/label';
import { CoreService } from 'src/app/core/service/CoreService.service';
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
  loading: boolean = false

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

  /**
   * Nutripax joined the lobby
   * Holcahust joined the lobby
   * @param players 
   * @returns 
   */
  loadPlayerRankedData(players: string): void {
    this.loading = true
    let playerNames: string[] = this.getPlayerNames(players)
    if (playerNames.length === 0) {
      console.error('pas de joueur')
      return
    }
    let playerResquests: Observable<any>[] = []
    this.matchService.getSummoners(playerNames).subscribe(players => {
      this.players = players
      this.loading = false
    })
  }

  getPlayerNames(players: string) : string[] {
        
    let res = players.replace(/( joined the lobby|\n)/g, ',').split(',').filter(n => n !== '')
    if (res.length !== 0) {
      return res
    }

    return []
  }

  isInterWinRate(winrate: number) : boolean{
    return winrate <= CONFIG.maxInterWinRate
  }

  isQuiteInterWinRate(winrate: number) : boolean{
    return winrate > CONFIG.minQuiteInterWinRate && winrate < CONFIG.maxQuiteInterWinRate
  }

  isRandomPlayerWinRate(winrate: number) : boolean{
    return winrate >= CONFIG.minRandomPlayerWinRate && winrate <= CONFIG.maxRandomPlayerWinRate
  }

  isQuiteCarryWinRate(winrate: number) : boolean{
    return winrate > CONFIG.minQuiteCarryWinRate && winrate <= CONFIG.maxQuiteCarryWinRate
  }

  isHyperCarryWinRate(winrate: number) : boolean{
    return winrate > CONFIG.minHyperCarryWinRate
  }

  isInterKDA(player: Player) : boolean { 
    return player.kdaRate <= CONFIG.maxInterKda
  }

  isQuiteInterKDA(player: Player) : boolean {
    return player.kdaRate > CONFIG.minQuiteInterKda && player.kdaRate <= CONFIG.maxQuiteInterKda
  }
  isRandomPlayerKDA(player: Player) : boolean {
    return player.kdaRate > CONFIG.minRandomPlayerKda && CONFIG.maxRandomPlayerKda
  }
  isQuiteCarryKDA(player: Player) : boolean {

    return player.kdaRate > CONFIG.minQuiteCarryKda && player.kdaRate <= CONFIG.maxQuiteCarryKda
  }
  isHyperCarryKDA(player: Player) : boolean {
    return player.kdaRate > CONFIG.minHyperCarryKda
  }

  
  getRankedPositionPicture(player: Player, match: Match) {
    let tier = CONFIG.rankedPositionTier[player.tier]
    tier = tier ? tier : player.tier
    let lane = CONFIG.rankedPositionLane[CoreService.capitalize(match.lane)]
    lane = lane ? lane : CoreService.capitalize(match.lane)
  
    return CONFIG.rankedPositionLabel 
    + tier
    + '-' 
    + lane
    + CONFIG.rankedPositionsExtension
  }

}
