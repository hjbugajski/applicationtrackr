import { Component } from '@angular/core';

import { Icons } from '~enums/icons.enum';
import { Paths } from '~enums/paths.enum';
import { AuthService } from '~services/auth/auth.service';
import { SidenavService } from '~services/sidenav/sidenav.service';

interface SidenavItem {
  icon: string;
  viewValue: string;
  route: string;
}

@Component({
  selector: 'at-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  public sidenavItems: SidenavItem[];

  constructor(private authService: AuthService, public sidenavService: SidenavService) {
    this.sidenavItems = [
      {
        icon: Icons.CarbonApplication,
        viewValue: 'Applications',
        route: Paths.Applications
      },
      {
        icon: Icons.CarbonChartMultitype,
        viewValue: 'Analytics',
        route: Paths.Analytics
      },
      {
        icon: Icons.CarbonTemplate,
        viewValue: 'Job Boards',
        route: Paths.JobBoards
      }
    ];
  }

  public async signOut(): Promise<void> {
    await this.authService.signOut();
  }

  public async toggleSidenav(): Promise<void> {
    if (this.sidenavService.showMenuButton.getValue()) {
      await this.sidenavService.sidenav.toggle();
    }
  }

  public get paths(): typeof Paths {
    return Paths;
  }
}
