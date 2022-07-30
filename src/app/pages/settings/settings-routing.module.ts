import { NgModule } from '@angular/core';
import { RouterModule, Routes, TitleStrategy } from '@angular/router';

import { SettingsComponent } from './settings.component';

import { Paths } from '~enums/paths.enum';
import { PageTitleStrategy } from '~utils/title-strategy.util';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      { path: '', pathMatch: 'prefix', redirectTo: Paths.Account },
      {
        path: Paths.Account,
        title: 'Account Settings',
        loadChildren: () => import('./account/account.module').then((m) => m.AccountModule)
      },
      {
        path: Paths.Appearance,
        title: 'Appearance Settings',
        loadChildren: () => import('./appearance/appearance.module').then((m) => m.AppearanceModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [{ provide: TitleStrategy, useClass: PageTitleStrategy }],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
