import { CONFIG } from "../../../config/config";
import { RiotGames } from "../../../types/riot-games/riot-games";

export class Match implements RiotGames.Match.MatchDetail {
  mapId: number;
  gameCreation: number;
  gameId: number;
  gameMode: string;
  gameType: string;
  matchVersion: string;
  participantIdentities: RiotGames.Match.ParticipantIdentity[];
  participants: RiotGames.Match.Participant[];
  platformId: string;
  region: string;
  seasonId: number;
  teams: RiotGames.Match.Team[];
  timeline: RiotGames.Match.Timeline;
  queueId: number;
  gameDuration: number;
  gameVersion: string;

  role: string
  champion: number
  lane: string
  
  static factory(match: any) : Match {
    let p = new Match()
    for (let property in match) {
      if (match.hasOwnProperty(property)) {
        p[property] = match[property]
      }
    }

    return p
  }

  getPlayerParticipant(summonerName: string) : RiotGames.Match.Participant {
    let summonerToMap = this.participantIdentities.find(p => p.player.summonerName === summonerName)
    let summonerParticipantId: number = summonerToMap.participantId
    return this.participants.find(p => p.participantId === summonerParticipantId)
  }

  getMatchResult(summonerName: string){
    let participant = this.getPlayerParticipant(summonerName)
    return CONFIG.win[this.teams.find(t => t.teamId === participant.teamId).win].value
  }

  getKDA(summonerName: string) : string {
    let participant = this.getPlayerParticipant(summonerName)
    return `${participant.stats.kills}/${participant.stats.deaths}/${participant.stats.assists}`
  }

  getTotalScoreRank(summonerName: string) {
    let participant = this.getPlayerParticipant(summonerName)
    return participant.stats.totalScoreRank
  }

  getTotalPlayerScore(summonerName: string) {
    let participant = this.getPlayerParticipant(summonerName)
    return participant.stats.totalPlayerScore
  }

  getCombatPlayerScore(summonerName: string) {
    let participant = this.getPlayerParticipant(summonerName)
    return participant.stats.combatPlayerScore
  }

  getObjectivePlayerScore(summonerName: string) {
    let participant = this.getPlayerParticipant(summonerName)
    return participant.stats.objectivePlayerScore
  }
}