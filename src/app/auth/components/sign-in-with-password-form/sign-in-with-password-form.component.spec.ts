import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInWithPasswordFormComponent } from './sign-in-with-password-form.component';

describe('SignInWithPasswordComponent', () => {
  let component: SignInWithPasswordFormComponent;
  let fixture: ComponentFixture<SignInWithPasswordFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignInWithPasswordFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInWithPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
