import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { MatchesService } from './matches.service';

describe('MatchesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: [
    ]
  }));

  it('should be created', () => {
    const service: MatchesService = TestBed.get(MatchesService);
    expect(service).toBeTruthy();
  });
});
