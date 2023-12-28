import { Dialog } from '@angular/cdk/dialog';
import { Component, HostBinding, HostListener, Input, OnInit } from '@angular/core';

import { ApplicationPanelComponent } from '~components/application-panel/application-panel.component';
import { Application } from '~models/application.model';
import { Column } from '~models/column.model';

@Component({
  selector: 'at-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.scss'],
})
export class ApplicationCardComponent implements OnInit {
  @Input() public application!: Application;
  @HostBinding('class') colorClass = '';
  @Input() public column!: Column;
  @HostBinding() role = 'button';
  @HostBinding() tabindex = 0;

  constructor(private dialog: Dialog) {}

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  public keydown(event: KeyboardEvent): void {
    event.preventDefault();
    this.openApplication();
  }

  ngOnInit(): void {
    this.colorClass = this.column.color;
  }

  public openApplication(): void {
    this.dialog.open(ApplicationPanelComponent, {
      data: {
        application: this.application,
        column: this.column,
      },
      disableClose: true,
      autoFocus: 'dialog',
    });
  }
}
