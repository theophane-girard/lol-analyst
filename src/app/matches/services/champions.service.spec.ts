import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ChampionsService } from './champions.service';

describe('ChampionsService', () => {
  let service: ChampionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
      ]
    });
    service = TestBed.inject(ChampionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
