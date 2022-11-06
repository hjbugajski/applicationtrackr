import { Component } from '@angular/core';

import { Paths } from '~enums/paths.enum';

@Component({
  selector: 'at-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  public get paths(): typeof Paths {
    return Paths;
  }
}
