import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobBoardSelectorComponent } from './job-board-selector.component';

describe('JobBoardSelectorComponent', () => {
  let component: JobBoardSelectorComponent;
  let fixture: ComponentFixture<JobBoardSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobBoardSelectorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobBoardSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
