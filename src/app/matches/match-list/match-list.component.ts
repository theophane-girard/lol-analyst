import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatchesService } from '../services/matches.service';
import { MatchToCSV } from '../models/match-to-csv';
import { CONFIG } from '../../../config/config';
import { formatDate, registerLocaleData} from "@angular/common";
import localeFr from '@angular/common/locales/fr';
import { RiotGames } from '../../../types/riot-games/riot-games';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { DateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { beginDateGreaterThanEndDate, dateRangeGreaterThanOneWeek } from 'src/app/core/validators/date';
import { CoreService } from 'src/app/core/service/CoreService.service';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { pairwise, startWith } from 'rxjs/operators';
registerLocaleData(localeFr);

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss'],
  animations: [
    trigger('heightAnimation', [
      state('*', style({
        height: '{{ height }}px'
      }), { params: { height: '0px' }}),
      transition('* => *', [
        animate('0.5s')
      ])
    ]),
    trigger('marginTopAnimation', [
      state('*', style({
        marginTop: '{{ margin }}px'
      }), { params: { margin: '0px' }}),
      transition('* => *', [
        animate('0.5s')
      ])
    ]),
    trigger('marginBotAnimation', [
      state('*', style({
        marginBottom: '{{ margin }}px'
      }), { params: { margin: '0px' }}),
      transition('* => *', [
        animate('0.5s')
      ])
    ]),
    trigger('queryVisuLabelOpacity', [
      state('visible', style({
        opacity: 1
      })),
      state('invisible', style({
        opacity: 0
      })),
      transition('* => *', [
        animate('1s')
      ])
    ]),
  ]
})
export class MatchListComponent implements OnInit, AfterViewInit {
  CREDENTIALS = environment.CREDENTIALS
  matches: RiotGames.Match.MatchDetail[] = []
  matchesToCSV: MatchToCSV[] = []
  form: FormGroup
  isLoading: boolean = false
  today: Date = new Date()
  defaultMinDate: Date = new Date(new Date().setMonth(new Date().getMonth() - 2));
  @ViewChild('timeSelection') timeSelection: ElementRef
  maxHeight: number = 0
  marginTop: number = 0
  marginBot: number = 0
  height: number = 0
  queryVisuLabelVisible: boolean = false

  constructor(
    private matchService: MatchesService,
    private formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>,
    private _snackBar: MatSnackBar,
  ) {
    this._adapter.setLocale('fr');
    this.today.setHours(0,0,0,0)
    this.defaultMinDate.setHours(0,0,0,0)
  }

  ngAfterViewInit(): void {
    this.maxHeight = this.timeSelection?.nativeElement.offsetHeight
  }

  ngOnInit() {

    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      beginIndex: new FormControl(CONFIG.matchStartIndex, [Validators.max(0), Validators.min(-100)]),
      endIndex: new FormControl(environment.matchAmount, [Validators.min(0), Validators.max(100)]),
      beginTime: new FormControl(null, [Validators.max(this.today.getTime())]),
      endTime: new FormControl(null, [Validators.max(this.today.getTime())]),
    },
    {
      validators: [
        dateRangeGreaterThanOneWeek('beginTime', 'endTime'),
        beginDateGreaterThanEndDate('beginTime', 'endTime')
      ]
    })

    this.form.valueChanges.subscribe(data => {
      let errors: any = {...this.form.errors, ...CoreService.collectFormErrors(this.form)}
      this.form.setErrors(Object.keys(errors).length !== 0 ? errors : null)
      console.log(this.form.errors)
    })

    this.form.controls.beginTime.valueChanges.pipe(
      startWith(undefined), 
      pairwise()
    ).subscribe(valuesArray => {
      const newVal = valuesArray[1];
      const oldVal = valuesArray[0];
      if (newVal !== oldVal) {
        this.adaptScale()
        this.marginTop = this.getMarginTopPx(this.form.controls.endTime.value)
        this.marginBot = this.getMarginBotPx(newVal)
        this.height = this.getHeightMatches()
        this.queryVisuLabelVisible = this.updateMatchesLabelState()
      }
    })
    this.form.controls.endTime.valueChanges.pipe(
      startWith(undefined), 
      pairwise()
    ).subscribe(valuesArray => {
      const newVal = valuesArray[1];
      const oldVal = valuesArray[0];
      if (newVal !== oldVal) {
        this.adaptScale()
        this.marginTop = this.getMarginTopPx(newVal)
        this.marginBot = this.getMarginBotPx(this.form.controls.beginTime.value)
        this.height = this.getHeightMatches()
        this.queryVisuLabelVisible = this.updateMatchesLabelState()
      }
    })
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
    this.isLoading = true
    this.matchService.getMatchesToCSV(this.form.getRawValue()).subscribe(
      (data: MatchToCSV[]) => {
        this.matchesToCSV = data
        this.isLoading = false
      },
      error => {
        console.error(error)
        this._snackBar.open(CONFIG.noMatchFoundMessage, CONFIG.closeLabel, {
          duration: CONFIG.notificationDuration,
        })
        this.isLoading = false
      }
    );
  }

  getMarginTopPx(date: Date) {
    let maxDays = Math.round(CoreService.getDayDiff(this.today, this.defaultMinDate))
    let dayDiffThanToday = Math.round(CoreService.getDayDiff(this.today, date))
    let maxHeight = this.timeSelection?.nativeElement.offsetHeight
    if (!date) {
      return 0
    }
    return Math.round(Math.abs(dayDiffThanToday * maxHeight / maxDays))
  }

  getHeightMatches() {
    let beginDate = this.form.controls.beginTime.value
    let endDate = this.form.controls.endTime.value
    let dayDiff = Math.round(CoreService.getDayDiff(beginDate, endDate))
    let maxDays = Math.round(CoreService.getDayDiff(this.today, this.defaultMinDate))
    let maxHeight = this.timeSelection?.nativeElement.offsetHeight

    if (!beginDate && !endDate) {
      return 0
    }

    if (beginDate && !endDate) {
      dayDiff = Math.round(CoreService.getDayDiff(beginDate, this.today))
      return Math.round(Math.abs(dayDiff *  maxHeight / maxDays))
    }

    if (!beginDate && endDate ) {
      dayDiff = Math.round(CoreService.getDayDiff(this.defaultMinDate, endDate))
      return Math.round(Math.abs(dayDiff *  maxHeight / maxDays))
    }
    return Math.round(Math.abs(dayDiff *  maxHeight / maxDays))
  }

  getMarginBotPx(date: Date) {
    let maxDays = Math.round(CoreService.getDayDiff(this.today, this.defaultMinDate))
    let dayDiffThanMax = Math.round(CoreService.getDayDiff(this.defaultMinDate, date))
    let maxHeight = this.timeSelection?.nativeElement.offsetHeight

    if (!date) {
      return 0
    }
    if (date && !this.form.controls.endTime.value) {
      return 0
    }
    if (date.getTime() === this.defaultMinDate.getTime()) {
      return 0
    }

    return  maxHeight - (Math.round(Math.abs((dayDiffThanMax *  maxHeight / maxDays))) + this.getHeightMatches())
  }

  updateMatchesLabelState(): boolean {
    if (!this.form.controls.beginTime.value && !this.form.controls.endTime.value) {
      return false
    }
    return true
  }

  adaptScale() {
    let beginTime: Date = this.form.controls.beginTime.value
    let endTime: Date = this.form.controls.endTime.value
    let beginEndTimeDayDiff
    if (endTime) {
      if (endTime < this.defaultMinDate) {
        this.defaultMinDate = endTime
      }
    }
    if (beginTime && endTime) {
      beginEndTimeDayDiff = Math.abs(CoreService.getDayDiff(beginTime, endTime))
      if(beginEndTimeDayDiff <= 9) {
        let endTimeTodayDiff = Math.abs(CoreService.getDayDiff(endTime, this.today))
        let result = new Date(beginTime.setDate(beginTime.getDate() - endTimeTodayDiff))
        this.defaultMinDate = result
      }
    }
  }
}
