import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { TITLE_SUFFIX } from '~constants/title.constant';
import { Paths } from '~enums/paths.enum';
import { RouteData } from '~interfaces/route-data.interface';

@Component({
  selector: 'at-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  constructor(private activatedRoute: ActivatedRoute, private titleService: Title) {
    const data = this.activatedRoute.snapshot.data as RouteData;

    this.titleService.setTitle(data.title + TITLE_SUFFIX);
  }

  public get paths(): typeof Paths {
    return Paths;
  }
}
