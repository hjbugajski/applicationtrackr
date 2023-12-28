import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationPanelNotesComponent } from './application-panel-notes.component';

describe('ApplicationPanelNotesComponent', () => {
  let component: ApplicationPanelNotesComponent;
  let fixture: ComponentFixture<ApplicationPanelNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationPanelNotesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationPanelNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
