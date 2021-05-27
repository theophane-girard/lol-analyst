import { Component, Input, OnInit } from '@angular/core';
import { LabelClasses } from '../models/label-classes';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit {
  @Input() label
  @Input() labelClasses: LabelClasses

  constructor() { }

  ngOnInit(): void {
  }

}
