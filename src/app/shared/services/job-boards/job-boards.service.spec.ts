import { TestBed } from '@angular/core/testing';

import { JobBoardsService } from './job-boards.service';

describe('JobBoardsService', () => {
  let service: JobBoardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobBoardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
