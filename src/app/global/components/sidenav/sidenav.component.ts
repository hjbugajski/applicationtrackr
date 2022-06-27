import { Component } from '@angular/core';

import { Icons } from '~enums/icons.enum';

interface SidenavItem {
  icon: string;
  viewValue: string;
}

@Component({
  selector: 'at-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  public title = 'ApplicationTrackr';
  public sidenavItems: SidenavItem[];

  constructor() {
    this.sidenavItems = [
      {
        icon: Icons.CarbonApplication,
        viewValue: 'Applications'
      },
      {
        icon: Icons.CarbonEmail,
        viewValue: 'Offers'
      },
      {
        icon: Icons.CarbonChartMultitype,
        viewValue: 'Analytics'
      },
      {
        icon: Icons.CarbonTemplate,
        viewValue: 'Job Boards'
      }
    ];
  }
}
