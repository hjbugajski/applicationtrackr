import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';

import { ManageAccountComponent } from './manage-account.component';

@NgModule({
  declarations: [ManageAccountComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule.forChild([{ path: '', component: ManageAccountComponent }])
  ],
  exports: [ManageAccountComponent]
})
export class ManageAccountModule {}