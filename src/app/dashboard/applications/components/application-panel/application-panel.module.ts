import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ApplicationPanelComponent } from './application-panel.component';

import { ApplicationPanelInfoModule } from '~components/application-panel-info/application-panel-info.module';
import { ApplicationPanelOfferModule } from '~components/application-panel-offer/application-panel-offer.module';
import { TagModule } from '~components/tag/tag.module';
import { DayDifferencePipeModule } from '~pipes/day-difference/day-difference.pipe.module';

@NgModule({
  declarations: [ApplicationPanelComponent],
  imports: [
    ApplicationPanelInfoModule,
    ApplicationPanelOfferModule,
    CommonModule,
    DayDifferencePipeModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    TagModule
  ],
  exports: [ApplicationPanelComponent]
})
export class ApplicationPanelModule {}
