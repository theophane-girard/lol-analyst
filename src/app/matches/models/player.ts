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