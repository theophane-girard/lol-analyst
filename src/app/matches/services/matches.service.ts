import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import { CONFIG } from "../../../config/config";
import { concatMap, map, switchMap } from "rxjs/operators";
import { from } from 'rxjs';
import { RiotGames } from "../../../types/riot-games/riot-games";
import { environment } from '../../../environments/environment';
import { MatchToCSV } from '../models/match-to-csv';

@Injectable({
  providedIn: 'root'
})
export class MatchesService {
  private matches: RiotGames.Match.MatchDetail[] = []
  public matches$: Subject<RiotGames.Match.MatchDetail[]> = new Subject()

  constructor(private http: HttpClient) {

  }

  getMatchesToCSV(start: number, count: number) {
    let param = new HttpParams()
    param = param.append('endIndex', `${count}`)
    param = param.append('beginIndex', `${start}`)
    param = param.append('queue', `${CONFIG.rankedQueueId}`)

    let url = CONFIG.apiMatchToCsvUrl

    return this.http.get<MatchToCSV>(url, { params: param })
  }

  getSummoners(summonerNames: string[]) {
    let url = CONFIG.apiSummonersUrl

    return this.http.post<any[]>(url, { names: summonerNames })
  }
}
