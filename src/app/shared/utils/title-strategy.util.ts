import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable()
export class PageTitleStrategy extends TitleStrategy {
  constructor(private title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);

    this.title.setTitle(title ? title + ' | ApplicationTrackr' : 'ApplicationTrackr');
  }
}
