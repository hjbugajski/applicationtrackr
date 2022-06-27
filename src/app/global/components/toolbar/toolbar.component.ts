import { Component } from '@angular/core';

import { SidenavService } from '~services/sidenav/sidenav.service';

@Component({
  selector: 'at-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  constructor(public sidenavService: SidenavService) {}

  public async toggleSidenav(): Promise<void> {
    await this.sidenavService.sidenav.toggle();
  }
}
