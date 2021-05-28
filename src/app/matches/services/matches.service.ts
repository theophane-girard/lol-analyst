import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import { CONFIG } from "../../../config/config";
import { CREDENTIALS } from "../../../config/credentials";
import { concatMap, map, switchMap } from "rxjs/operators";
import { from } from 'rxjs';
import { RiotGames } from "../../../types/riot-games/riot-games";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatchesService {
  private matches: RiotGames.Match.MatchDetail[] = []
  public matches$: Subject<RiotGames.Match.MatchDetail[]> = new Subject()

  constructor(private http: HttpClient) {
    
  }

  updateMatchesToCSV() {
    let matchesRequest$: Observable<any>[] = []

    this.getSummoner(CREDENTIALS.summonerName).pipe(
      switchMap((data: any) => this.getLastMatchIdList(CONFIG.matchStartIndex, environment.matchAmount, data)),
      switchMap((response: any) => from(response.matches)),
      map((match: RiotGames.Match.MatchDetail) => matchesRequest$.push(this.getMatchById(match.gameId))),
      switchMap(() => forkJoin(matchesRequest$)),
    ).subscribe((matches: RiotGames.Match.MatchDetail[]) => this.addMatch(matches))
  }

  getLastMatchIdList(start: number, count: number, account: any) {
    let param = new HttpParams()
    param = param.append('endIndex', `${count}`)
    param = param.append('beginIndex', `${start}`)
    param = param.append('queue', `${CONFIG.rankedQueueId}`)

    let url = CONFIG.apiUrlMatchesByAccountId 
      + account.accountId

    return this.http.get<RiotGames.MatchList.MatchList>(url, { params: param })
  }

  getMatchListByChampId(id: number, account: any) {
    let param = new HttpParams()
    param = param.append('queue', `${CONFIG.rankedQueueId}`)
    param = param.append('champion', id)

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

  addMatch(matches: RiotGames.Match.MatchDetail[]) {
    this.matches = matches
    this.notifyMatchesChanged()
  }
  
  notifyMatchesChanged() {
    this.matches$.next(this.matches.slice()) 
  }
}
