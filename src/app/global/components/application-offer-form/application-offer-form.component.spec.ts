import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationOfferFormComponent } from './application-offer-form.component';

describe('ApplicationOfferFormComponent', () => {
  let component: ApplicationOfferFormComponent;
  let fixture: ComponentFixture<ApplicationOfferFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationOfferFormComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationOfferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
