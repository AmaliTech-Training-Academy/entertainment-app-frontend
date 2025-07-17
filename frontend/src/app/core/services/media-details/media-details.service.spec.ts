import { TestBed } from '@angular/core/testing';

import { MediaDetailsService } from './media-details.service';

describe('MediaDetailsService', () => {
  let service: MediaDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
