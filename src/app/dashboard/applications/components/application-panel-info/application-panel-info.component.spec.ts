import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationPanelInfoComponent } from './application-panel-info.component';

describe('ApplicationPanelInfoComponent', () => {
  let component: ApplicationPanelInfoComponent;
  let fixture: ComponentFixture<ApplicationPanelInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationPanelInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationPanelInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
