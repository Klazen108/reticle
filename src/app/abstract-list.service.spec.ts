import { TestBed } from '@angular/core/testing';

import { AbstractListService } from './abstract-list.service';

describe('AbstractListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AbstractListService = TestBed.get(AbstractListService);
    expect(service).toBeTruthy();
  });
});
