import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationInfoFormComponent } from './application-info-form.component';

describe('ApplicationInfoFormComponent', () => {
  let component: ApplicationInfoFormComponent;
  let fixture: ComponentFixture<ApplicationInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationInfoFormComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
