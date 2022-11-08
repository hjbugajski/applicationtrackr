import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { Icons } from '~enums/icons.enum';

@Injectable({
  providedIn: 'root'
})
export class MatIconService {
  constructor(private domSanitizer: DomSanitizer, private matIconRegistry: MatIconRegistry) {
    this.matIconRegistry.setDefaultFontSetClass('material-symbols-rounded');
  }

  public initializeMatIcons(): void {
    Object.values(Icons).forEach((icon) =>
      this.matIconRegistry.addSvgIcon(
        icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/' + icon + '.svg')
      )
    );
  }
}
