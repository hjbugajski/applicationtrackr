import { Component, OnDestroy } from '@angular/core';
import { filter, Subscription } from 'rxjs';

import { Icons } from '~enums/icons.enum';
import { Themes } from '~enums/themes.enum';
import { ThemeService } from '~services/theme/theme.service';
import { UserService } from '~services/user/user.service';
import { UserStore } from '~store/user.store';

interface Theme {
  class: Themes;
  icon: Icons | string;
  viewValue: string;
}

@Component({
  selector: 'at-appearance',
  templateUrl: './appearance.component.html',
  styleUrls: ['./appearance.component.scss']
})
export class AppearanceComponent implements OnDestroy {
  public selectedTheme: Themes | string | undefined;
  public themesArray: Theme[];

  private subscription: Subscription;

  constructor(private themeService: ThemeService, private userService: UserService, private userStore: UserStore) {
    this.themesArray = [
      { class: Themes.Light, icon: this.getIconPath(Icons.LightTheme), viewValue: 'Light' },
      { class: Themes.Dark, icon: this.getIconPath(Icons.DarkTheme), viewValue: 'Dark' },
      { class: Themes.System, icon: this.getIconPath(Icons.SystemTheme), viewValue: 'System' }
    ];
    this.subscription = new Subscription();
    this.subscription.add(
      this.userStore.appearance$.pipe(filter((value) => !!value)).subscribe((value) => (this.selectedTheme = value!))
    );
  }

  public get themes(): typeof Themes {
    return Themes;
  }

  public isSelectedTheme(theme: Theme): boolean {
    return this.selectedTheme === theme.class;
  }

  public async keydown(event: KeyboardEvent, theme: Theme): Promise<void> {
    if (event.key === 'Enter' || event.key === ' ') {
      await this.setTheme(theme.class);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public async setTheme(theme: Themes): Promise<void> {
    this.themeService.setTheme(theme);
    this.selectedTheme = theme;
    await this.userService.updateAppearance(theme);
  }

  private getIconPath(icon: Icons | string): string {
    return '../../../../assets/icons/' + icon + '.svg';
  }
}
