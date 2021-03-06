import { Component, OnInit } from '@angular/core';
import { MatchesService } from '../services/matches.service';
import { MatchToCSV } from '../models/match-to-csv';
import { CONFIG } from '../../../config/config';
import { formatDate, registerLocaleData} from "@angular/common";
import localeFr from '@angular/common/locales/fr';
import { RiotGames } from '../../../types/riot-games/riot-games';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { DateAdapter } from '@angular/material/core';
registerLocaleData(localeFr);

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss']
})
export class MatchListComponent implements OnInit {
  CREDENTIALS = environment.CREDENTIALS
  matches: RiotGames.Match.MatchDetail[] = []
  matchesToCSV: MatchToCSV[] = []
  form: FormGroup

  constructor(
    private matchService: MatchesService,
    private formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>
  ) {
    this._adapter.setLocale('fr');
  }

  ngOnInit() {

    this.form = new FormGroup({
      name: new FormControl(),
      beginIndex: new FormControl(CONFIG.matchStartIndex, [Validators.max(0), Validators.min(-100)]),
      endIndex: new FormControl(environment.matchAmount, [Validators.min(0), Validators.max(100)]),
      beginTime: new FormControl(),
      endTime: new FormControl(),
    })
    // this.matchService.matches$.subscribe(matches => this.generateCSVData(matches))
  }

  generateCSVData(matches: RiotGames.Match.MatchDetail[]): void {
    this.matches = matches
    this.matches.forEach(match => this.pushToMatchesCSV(match, matches));
    this.matchesToCSV = this.matchesToCSV.sort((a,b) => this.sortByDateAndGameNumber(a, b))
  }

  getGameNumber(
    match: RiotGames.Match.MatchDetail, 
    matches: RiotGames.Match.MatchDetail[], 
    date: Date
  ): number {
    let dayMatches = matches.filter(m => (new Date(m.gameCreation)).getDate() === date.getDate())
    dayMatches = dayMatches.sort((a, b) => a.gameCreation - b.gameCreation)
    return dayMatches.indexOf(match) + 1
  }

  formatWin(winner: string): string {
    return CONFIG.win[winner].label
  }

  sortByDateAndGameNumber(a, b) {
    let o1 = a.date;
    let o2 = b.date;
    let p1 = a.gameNumber;
    let p2 = b.gameNumber;

    if (o1 < o2) return -1;
    if (o1 > o2) return 1;
    if (p1 < p2) return -1;
    if (p1 > p2) return 1;
    return 0;
  }

  pushToMatchesCSV(match: RiotGames.Match.MatchDetail, matches: RiotGames.Match.MatchDetail[]) {
    let summonerToMap = match.participantIdentities.find(p => p.player.summonerName === this.CREDENTIALS.summonerName)
    let date = new Date(match.gameCreation)
    let summonerParticipantId: number = summonerToMap.participantId
    let participant = match.participants.find(p => p.participantId === summonerParticipantId)
    let win = match.teams.find(team => team.teamId === participant.teamId).win

    let matchToCSV: MatchToCSV = {
      date: formatDate(date, 'dd/MM/yyyy', CONFIG.locale),
      day: CONFIG.daysOfWeek[date.getDay()],
      hour: formatDate(date, 'HH:mm:00', CONFIG.locale),
      win: this.formatWin(win),
      gameNumber: this.getGameNumber(match, matches, date)
    }
    this.matchesToCSV.push(matchToCSV)
  }
  getMatchToCSV() {
    this.matchService.getMatchesToCSV(this.form.getRawValue()).subscribe((data: MatchToCSV[]) => this.matchesToCSV = data);
  }
}
