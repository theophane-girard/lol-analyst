import { Component, OnInit } from '@angular/core';
import { MatchesService } from '../services/matches.service';
import {} from "riot-games-api";
import { MatchToCSV } from '../models/match-to-csv';
import { CONFIG } from 'src/config/config';
import { formatDate } from "@angular/common";
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss']
})
export class MatchListComponent implements OnInit {
  CONFIG = CONFIG
  matches: RiotGamesAPI.Match.MatchDetail[] = []
  matchesToCSV: MatchToCSV[] = []

  constructor(private matchService: MatchesService) { }

  ngOnInit() {
    this.matchService.matches$.subscribe(matches => this.generateCSVData(matches))
  }

  generateCSVData(matches: RiotGamesAPI.Match.MatchDetail[]): void {
    this.matches = matches
    this.matches.forEach(match => {
      let sum = match.participantIdentities.find(p => p.player.summonerName === this.CONFIG.summonerName)
      let date = new Date(match.gameCreation)
      let partId: number = sum.participantId
      let matchToCSV: MatchToCSV = {
        date: formatDate(date, 'dd/MM/yyyy', 'fr-FR'),
        day: this.CONFIG.daysOfWeek[date.getDay()],
        hour: formatDate(date, 'HH:mm:00', 'fr-FR'),
        win: this.formatWin(match.teams.find(team => team.teamId === match.participants.find(p => p.participantId === partId).teamId).win),
        gameNumber: this.getGameNumber(match, matches, date)
      }
      this.matchesToCSV.push(matchToCSV)
    });
    
    this.matchesToCSV = this.matchesToCSV.sort((a,b) => this.sortByDateAndGameNumber(a, b))
  }
  getGameNumber(match: RiotGamesAPI.Match.MatchDetail, matches: RiotGamesAPI.Match.MatchDetail[], date: Date): number {
    let dayMatches = matches.filter(m => (new Date(m.gameCreation)).getDate() === date.getDate()).sort((a, b) => a.gameCreation - b.gameCreation)
    return dayMatches.indexOf(match) + 1
  }

  formatWin(winner: string): string {
    if (winner === 'Win') {
      return 'V'
    } else {
      return 'D'
    }
  }

  sortByDateAndGameNumber(a, b) {
    var o1 = a.date;
    var o2 = b.date;

    var p1 = a.gameNumber;
    var p2 = b.gameNumber;

    if (o1 < o2) return -1;
    if (o1 > o2) return 1;
    if (p1 < p2) return -1;
    if (p1 > p2) return 1;
    return 0;
  }

}
