import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobBoardDialogComponent } from './job-board-dialog.component';

describe('JobBoardDialogComponent', () => {
  let component: JobBoardDialogComponent;
  let fixture: ComponentFixture<JobBoardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobBoardDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobBoardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
