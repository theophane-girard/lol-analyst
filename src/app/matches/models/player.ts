import { CoreService } from "../../../app/core/service/CoreService.service";
import { CONFIG } from "../../../config/config";
import { environment } from "../../../environments/environment";
import { RiotGames } from "../../../types/riot-games/riot-games";
import { Label } from "./label";
import { Match } from "./match";

export class Player implements RiotGames.Summoner.SummonerDto{
  accountId: string;
  profileIconId: number;
  revisionDate: number;
  name: string;
  id: string;
  puuid: string;
  summonerLevel: number;
  winrate: number
  matches: Match[]
  league: RiotGames.League.LeagueDto[]
  labels: Label[]
  kdaRate: number
  kda: string
  tier: string

  getSoloRankedLeague() : RiotGames.League.LeagueDto {
    return this.league.find(l => l.queueType === CONFIG.soloRankedLabel)
  }

  getValue(index: string) : any {
    let rankedSoloLeague = this.getSoloRankedLeague()
    if (!rankedSoloLeague.hasOwnProperty(index)) {
      console.error(`${index} is not defined in league`, this.league);
    }
    return this.getSoloRankedLeague()[index]
  }

  getWins() : number {
    if (this.league.length === 0) {
      return -1
    }
    return this.getSoloRankedLeague().wins
  }

  getLosses() : number {
    if (this.league.length === 0) {
      return -1
    }
    return this.getSoloRankedLeague().losses
  }

  isOnHotStreak() : boolean {
    if (this.league.length === 0) {
      return false
    }
    return this.getSoloRankedLeague().hotStreak
  }
  
  getTier() : string {
    if (this.league.length === 0) {
      return CONFIG.unrankedLabel
    }
    return CoreService.capitalize(this.getSoloRankedLeague().tier)
  }
  
  getRank() : string {
    if (this.league.length === 0) {
      return CONFIG.unrankedLabel
    }
    return CoreService.capitalize(this.getSoloRankedLeague().tier) + ' ' + this.getSoloRankedLeague().rank
  }

  static factory(player: any) : Player {
    let p = new Player()
    for (let property in player) {
      if (player.hasOwnProperty(property)) {
        p[property] = player[property]
      }
    }

    return p
  }
  
  getAverageKda(): string {
    return `${this.getAverageByIndex('kills')}/${this.getAverageByIndex('deaths')}/${this.getAverageByIndex('assists')}`
  }
  
  getAverageKdaRate(): number {
    return (this.getAverageByIndex('kills') + this.getAverageByIndex('assists')) / this.getAverageByIndex('deaths')
  }

  getAverageByIndex(index: string) : number {
    let average = 0
    this.matches.forEach(m => average += m.getPlayerParticipant(this.name).stats[index])

    average = Math.round((average / environment.matchAmount) * 10 ) /10
    return average
  }
}