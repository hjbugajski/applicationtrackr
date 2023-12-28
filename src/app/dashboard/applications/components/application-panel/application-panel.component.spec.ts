import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationPanelComponent } from './application-panel.component';

describe('ApplicationPanelComponent', () => {
  let component: ApplicationPanelComponent;
  let fixture: ComponentFixture<ApplicationPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
