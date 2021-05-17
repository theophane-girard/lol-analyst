import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatchesModule } from './matches/matches.module';
import { RouterModule, Routes } from '@angular/router';
import { MatchListComponent } from './matches/match-list/match-list.component';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: '', component: MatchListComponent },
  // { path: 'second-component', component: SecondComponent },
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatchesModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
  ],
  exports: [
    RouterModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
