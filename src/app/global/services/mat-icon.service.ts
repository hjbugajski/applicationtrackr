import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { ICONS } from '../constants/icons.constants';

@Injectable({
  providedIn: 'root'
})
export class MatIconService {
  constructor(private domSanitizer: DomSanitizer, private matIconRegistry: MatIconRegistry) {}

  public initializeMatIcons(): void {
    Object.values(ICONS).forEach((icon) => {
      this.matIconRegistry.addSvgIcon(icon.NAME, this.domSanitizer.bypassSecurityTrustResourceUrl(icon.LOCATION));
    });
  }
}
