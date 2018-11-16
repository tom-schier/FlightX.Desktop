import { TestBed } from '@angular/core/testing';

import { MongoDataService } from './mongo-data.service';

describe('MongoDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MongoDataService = TestBed.get(MongoDataService);
    expect(service).toBeTruthy();
  });
});
