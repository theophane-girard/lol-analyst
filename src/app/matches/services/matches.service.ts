import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CONFIG } from "../../../config/config";
import { CREDENTIALS } from "../../../config/credentials";
import { concatMap, switchMap } from "rxjs/operators";
import { from } from 'rxjs';
import { RiotGames } from "../../../types/riot-games/riot-games";

@Injectable({
  providedIn: 'root'
})
export class MatchesService {
  private matches: RiotGames.Match.MatchDetail[] = []
  public matches$: Subject<RiotGames.Match.MatchDetail[]> = new Subject()

  constructor(private http: HttpClient) { 
    this.getSummoner(CREDENTIALS.summonerName).pipe(
      switchMap((data: any) => this.getLastMatchIdList(CONFIG.matchStartIndex, CONFIG.matchAmount, data)),
      switchMap((response: any) => from(response.matches)),
      concatMap((match: any) => this.getMatchById(match.gameId))
    ).subscribe((match: RiotGames.Match.MatchDetail) => this.addMatch(match))
  }

  getLastMatchIdList(start: number, count: number, account: any) {
    let param = new HttpParams()
    param = param.append('endIndex', `${count}`)
    param = param.append('beginIndex', `${start}`)

    let url = CONFIG.apiUrlMatchesByAccountId 
      + account.accountId

    return this.http.get<RiotGames.MatchList.MatchList>(url, { params: param })
  }

  getMatchById(id: number) {
    let url = CONFIG.apiUrlMatchesById + id

    return this.http.get<RiotGames.Match.MatchDetail>(url);
  }

  getSummoner(summonerName: string) {
    let url = CONFIG.apiUrlGetSummoner + summonerName

    return this.http.get<RiotGames.Summoner.SummonerDto>(url);
  }

  getSummonerLeague(id: string) {
    let url = CONFIG.apiUrlGetSummonerLeague + id

    return this.http.get<RiotGames.League.LeagueDto[]>(url);
  }

  addMatch(match: RiotGames.Match.MatchDetail) {
    this.matches.push(match)
    if (this.matches.length === CONFIG.matchAmount) {
      this.notifyMatchesChanged()
    }
  }
  
  notifyMatchesChanged() {
    this.matches$.next(this.matches.slice()) 
  }
}
