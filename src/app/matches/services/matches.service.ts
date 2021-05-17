import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CONFIG } from "../../../config/config";
import { CREDENTIALS } from "../../../config/credentials";
import { concatMap, map, switchMap } from "rxjs/operators";
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatchesService {
  private CONFIG = CONFIG
  private CREDENTIALS = CREDENTIALS
  private matches: RiotGamesAPI.Match.MatchDetail[] = []
  public matches$: Subject<RiotGamesAPI.Match.MatchDetail[]> = new Subject()

  constructor(private http: HttpClient) { 
    this.getSummoner().pipe(
      switchMap((data: any) => this.getLastMatchIdList(0, this.CONFIG.matchAmount, data)),
      switchMap((response: any) => from(response.matches)),
      concatMap((match: any) => this.getMatchById(match.gameId))
    ).subscribe((match: RiotGamesAPI.Match.MatchDetail) => this.addMatch(match))
  }

  getLastMatchIdList(start: number, count: number, account: any) {
    let param =  new HttpParams()
    let httpOptions = {
      params: param
    };
    let url = this.CONFIG.apiUrl 
      + this.CONFIG.apiUrlMatchesByAccountId 
      + account.accountId
      + '?endIndex=' + count
      + '&beginIndex=' + start
      + '&api_key=' + this.CREDENTIALS.apiKey

    return this.http.get<string[]>(url, httpOptions);
  }

  getMatchById(id: number) {
    let param =  new HttpParams()
    let httpOptions = {
      params: param
    };
    let url = this.CONFIG.apiUrl 
      + this.CONFIG.apiUrlMatchesById 
      + id
      + '?api_key=' + this.CREDENTIALS.apiKey

    return this.http.get<RiotGamesAPI.Match.MatchDetail>(url, httpOptions);
  }

  getSummoner() {
    let param =  new HttpParams()
    param.set('summonerName', this.CREDENTIALS.summonerName)
    let headers = new HttpHeaders()
    let httpOptions = {
      headers: headers,
      params: param
    };
    let url = this.CONFIG.apiUrl + this.CONFIG.apiUrlGetSummoner + this.CREDENTIALS.summonerName + '?api_key=' + this.CREDENTIALS.apiKey

    return this.http.get<string[]>(url, httpOptions);
  }

  addMatch(match: RiotGamesAPI.Match.MatchDetail) {
    this.matches.push(match)
    if (this.matches.length === this.CONFIG.matchAmount) {
      this.notifyMatchesChanged()
    }
  }
  
  notifyMatchesChanged() {
    this.matches$.next(this.matches.slice()) 
  }
}
