import { Component } from '@angular/core';

import { Paths } from '~enums/paths.enum';

@Component({
  selector: 'at-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  public get paths(): typeof Paths {
    return Paths;
  }
}
