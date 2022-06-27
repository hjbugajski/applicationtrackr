import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { TITLE_SUFFIX } from '~constants/title.constant';
import { Paths } from '~enums/paths.enum';
import { RouteData } from '~interfaces/route-data.interface';
import { AuthService } from '~services/auth/auth.service';

@Component({
  selector: 'at-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  public email: FormControl;
  public isLoading: boolean;

  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService, private titleService: Title) {
    const data = this.activatedRoute.snapshot.data as RouteData;

    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.isLoading = false;

    this.titleService.setTitle(data.title + TITLE_SUFFIX);
  }

  public async sendPasswordResetEmail(): Promise<void> {
    if (this.email.valid) {
      this.isLoading = true;

      const email = this.email.value as string;

      await this.authService.sendPasswordResetEmail(email).then(() => (this.isLoading = false));
    }
  }

  public getFormControlError(): string {
    if (this.email.hasError('email')) {
      return 'Invalid email';
    }

    return 'Required';
  }

  public get paths(): typeof Paths {
    return Paths;
  }
}
