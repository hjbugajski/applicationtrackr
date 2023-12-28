import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInWithAppleButtonComponent } from './sign-in-with-apple-button.component';

describe('SignInWithAppleComponent', () => {
  let component: SignInWithAppleButtonComponent;
  let fixture: ComponentFixture<SignInWithAppleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignInWithAppleButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInWithAppleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
