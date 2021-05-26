import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CONFIG } from 'src/config/config';
import { RiotGames } from 'src/types/riot-games/riot-games';

@Injectable({
  providedIn: 'root'
})
export class ChampionsService {
  private champions: RiotGames.Champion.Champion[]
  public champions$: Subject<RiotGames.Champion.Champion[]> = new Subject()

  constructor(private http: HttpClient) {
    this.getChampions().subscribe(data => this.setChampions(data))
  }

  setChampions(data: RiotGames.Champion.ChampionList): void {
    this.champions = Object.values(data.data);
    this.notifyChampionsChanged()
  }

  public getChampion(id: number) : RiotGames.Champion.Champion {
    console.log(this.champions)
    
    return this.champions.find(c => +c.key === id)
  }

  notifyChampionsChanged() {
    // this.champions$.next(this.champions.slice())
  }
  
  private getChampions() : Observable<RiotGames.Champion.ChampionList> {
    let param = new HttpParams()
    param = param.append('isDataDragon', true)
    let url = CONFIG.championsUrl

    return this.http.get<RiotGames.Champion.ChampionList>(url, { params: param })
  }

}
