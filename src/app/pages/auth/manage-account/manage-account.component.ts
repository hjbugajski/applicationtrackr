import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface IAuthParams {
  mode: string;
  oobCode: string;
}

@Component({
  selector: 'at-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.scss']
})
export class ManageAccountComponent implements OnInit {
  public title: string | undefined;
  public params: IAuthParams;

  constructor(private activatedRoute: ActivatedRoute) {
    this.params = this.activatedRoute.snapshot.queryParams as IAuthParams;
  }

  ngOnInit(): void {
    this.setTitle(this.params);
  }

  private setTitle(params: IAuthParams): void {
    switch (params.mode) {
      case 'resetPassword':
        this.title = 'Reset password';
        break;
      case 'recoverEmail':
        this.title = 'Recover email';
        break;
      case 'verifyEmail':
        this.title = 'Verify email';
        break;
      default:
        this.title = 'Return to dashboard';
        break;
    }
  }
}
