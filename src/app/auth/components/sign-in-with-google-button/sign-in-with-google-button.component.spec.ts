import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInWithGoogleButtonComponent } from './sign-in-with-google-button.component';

describe('SignInWithGoogleComponent', () => {
  let component: SignInWithGoogleButtonComponent;
  let fixture: ComponentFixture<SignInWithGoogleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignInWithGoogleButtonComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInWithGoogleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
