import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable()
export class PageTitleStrategy extends TitleStrategy {
  constructor(@Inject(DOCUMENT) private document: Document) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);

    this.document.title = title ? title + ' | ApplicationTrackr' : 'ApplicationTrackr';
  }
}
