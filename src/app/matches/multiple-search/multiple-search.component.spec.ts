import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { MultipleSearchComponent } from './multiple-search.component';

describe('MultipleSearchComponent', () => {
  let component: MultipleSearchComponent;
  let fixture: ComponentFixture<MultipleSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleSearchComponent ],
      imports: [HttpClientModule],
      providers: [
        {
          provide: FormBuilder
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
