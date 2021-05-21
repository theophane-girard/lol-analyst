import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    MatInputModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class MaterialModule { }
