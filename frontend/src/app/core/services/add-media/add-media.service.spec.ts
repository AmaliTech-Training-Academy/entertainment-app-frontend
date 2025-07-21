import { TestBed } from '@angular/core/testing';

import { AddMediaService } from './add-media.service';

describe('AddMediaService', () => {
  let service: AddMediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddMediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
