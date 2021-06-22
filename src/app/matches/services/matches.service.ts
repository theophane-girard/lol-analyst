import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import { CONFIG } from "../../../config/config";
import { concatMap, map, switchMap } from "rxjs/operators";
import { from } from 'rxjs';
import { RiotGames } from "../../../types/riot-games/riot-games";
import { environment } from '../../../environments/environment';
import { MatchToCSV } from '../models/match-to-csv';
import { MatchCsvRequest } from '../models/match-csv-request';

@Injectable({
  providedIn: 'root'
})
export class MatchesService {
  private matches: RiotGames.Match.MatchDetail[] = []
  public matches$: Subject<RiotGames.Match.MatchDetail[]> = new Subject()

  constructor(private http: HttpClient) {

  }

  getMatchesToCSV(params: MatchCsvRequest) {
    let body = params

    let url = CONFIG.apiMatchToCsvUrl

    return this.http.post<MatchToCSV[]>(url, body)
  }

  getSummoners(summonerNames: string[]) {
    let url = CONFIG.apiSummonersUrl

    return this.http.post<any[]>(url, { names: summonerNames })
  }
}
