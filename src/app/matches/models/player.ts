import { CONFIG } from "src/config/config";
import { RiotGames } from "src/types/riot-games/riot-games";
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
    return this.getSoloRankedLeague().wins
  }

  getLosses() : number {
    return this.getSoloRankedLeague().losses
  }

  isOnHotStreak() : boolean {
    return this.getSoloRankedLeague().hotStreak
  }
  
  getTier() : string {
    return this.getSoloRankedLeague().tier
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
}