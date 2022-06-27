import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PrivacyPolicyComponent } from './privacy-policy.component';

import { Paths } from '~enums/paths.enum';

const routes: Routes = [{ path: Paths.PrivacyPolicy, component: PrivacyPolicyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivacyPolicyRoutingModule {}
