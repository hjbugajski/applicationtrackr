import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import * as ICONS from '~constants/icons.constants';

@Injectable({
  providedIn: 'root'
})
export class MatIconService {
  constructor(private domSanitizer: DomSanitizer, private matIconRegistry: MatIconRegistry) {}

  public initializeMatIcons(): void {
    Object.values(ICONS).forEach((ICON) => {
      this.matIconRegistry.addSvgIcon(ICON.NAME, this.domSanitizer.bypassSecurityTrustResourceUrl(ICON.LOCATION));
    });
  }
}
