import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchesService } from './services/matches.service';
import { MatchListComponent } from './match-list/match-list.component';

@NgModule({
  declarations: [MatchListComponent],
  imports: [
    CommonModule
  ],
  exports: [
    MatchListComponent
  ],
  providers:[
    MatchesService
  ]
})
export class MatchesModule { }
