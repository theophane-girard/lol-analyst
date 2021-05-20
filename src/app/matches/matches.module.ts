import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchesService } from './services/matches.service';
import { MatchListComponent } from './match-list/match-list.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [MatchListComponent],
  imports: [
    CommonModule,
    MaterialModule,    
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    MatchListComponent
  ],
  providers:[
    MatchesService
  ]
})
export class MatchesModule { }
