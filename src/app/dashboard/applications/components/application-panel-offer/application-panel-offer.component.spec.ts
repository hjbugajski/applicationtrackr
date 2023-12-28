import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationPanelOfferComponent } from './application-panel-offer.component';

describe('ApplicationPanelOfferComponent', () => {
  let component: ApplicationPanelOfferComponent;
  let fixture: ComponentFixture<ApplicationPanelOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationPanelOfferComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationPanelOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
