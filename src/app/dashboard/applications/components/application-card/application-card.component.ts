import { Component, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ApplicationDialogComponent } from '~components/application-dialog/application-dialog.component';
import { Application } from '~models/application.model';
import { Column } from '~models/column.model';

@Component({
  selector: 'at-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.scss']
})
export class ApplicationCardComponent implements OnInit {
  @Input() public application!: Application;
  @HostBinding('class') colorClass = '';
  @Input() public column!: Column;
  @HostBinding() role = 'button';
  @HostBinding() tabindex = 0;

  constructor(private matDialog: MatDialog) {}

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  public keydown(event: KeyboardEvent): void {
    event.preventDefault();
    this.openApplication();
  }

  @HostListener('click')
  public openApplication(): void {
    this.matDialog.open(ApplicationDialogComponent, {
      data: {
        application: this.application,
        column: this.column
      },
      disableClose: true,
      panelClass: ['at-dialog', 'mat-dialog-container-with-toolbar']
    });
  }

  ngOnInit(): void {
    this.colorClass = this.column.color;
  }
}
