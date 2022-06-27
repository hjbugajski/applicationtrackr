import { Component, OnInit } from '@angular/core';

import { MatIconService } from '~services/mat-icon/mat-icon.service';
import { ThemeService } from '~services/theme/theme.service';

@Component({
  selector: 'at-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private matIconService: MatIconService, private themeService: ThemeService) {}

  ngOnInit(): void {
    this.matIconService.initializeMatIcons();
    this.themeService.initTheme();
  }
}
