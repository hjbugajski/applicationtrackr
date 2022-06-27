import { Component } from '@angular/core';

import { Icons } from '~enums/icons.enum';
import { AuthService } from '~services/auth/auth.service';

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
  public sidenavItems: SidenavItem[];

  constructor(private authService: AuthService) {
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

  public async signOut(): Promise<void> {
    await this.authService.signOut();
  }
}
