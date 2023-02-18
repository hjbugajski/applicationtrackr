import { ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { lastValueFrom, Observable } from 'rxjs';

import { ConfirmationDialogComponent } from '~components/confirmation-dialog/confirmation-dialog.component';
import { DialogActions } from '~enums/dialog-actions.enum';
import { ApplicationDoc } from '~interfaces/application-doc.interface';
import { ConfirmationDialog } from '~interfaces/confirmation-dialog.interface';
import { Application } from '~models/application.model';
import { Column } from '~models/column.model';
import { ApplicationsService } from '~services/applications/applications.service';
import { NotificationService } from '~services/notification/notification.service';

@Component({
  selector: 'at-application-panel-notes',
  templateUrl: './application-panel-notes.component.html',
  styleUrls: ['./application-panel-notes.component.scss']
})
export class ApplicationPanelNotesComponent implements OnInit {
  @Input() public application!: Application;
  @Input() public column!: Column;
  @ViewChildren(MatInput) public matInputs: QueryList<MatInput> | undefined;

  public isEditing = false;
  public isLoading = false;
  public noteForm = new FormGroup({
    note: new FormControl<string | null>(null, [Validators.maxLength(4000)])
  });

  constructor(
    private applicationsService: ApplicationsService,
    private changeDetectorRef: ChangeDetectorRef,
    private matDialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  public get note(): AbstractControl<string | null> {
    return this.noteForm.controls.note;
  }

  public async cancel(): Promise<void> {
    if (this.noteForm.pristine) {
      this.isEditing = false;

      return;
    }

    const data: ConfirmationDialog = {
      action: DialogActions.Discard,
      item: 'edits'
    };
    const dialogAction = await lastValueFrom(
      this.matDialog
        .open(ConfirmationDialogComponent, {
          autoFocus: false,
          data,
          disableClose: true,
          width: '315px',
          panelClass: 'at-dialog-with-padding'
        })
        .afterClosed() as Observable<DialogActions>
    );

    if (dialogAction === DialogActions.Discard) {
      this.isEditing = false;
      this.noteForm.reset();
      this.initNoteForm();
    }
  }

  public edit(): void {
    this.isEditing = true;
    this.changeDetectorRef.detectChanges();
    this.matInputs?.get(0)?.focus();
  }

  public getError(control: AbstractControl): string | undefined {
    return control.hasError('maxlength') ? 'Length must be less than 4,000' : undefined;
  }

  ngOnInit(): void {
    this.initNoteForm();
  }

  public async save(): Promise<void> {
    if (this.noteForm.valid) {
      this.isLoading = true;

      const application: Partial<ApplicationDoc> = { note: this.note.value };

      await this.applicationsService
        .updateApplication(this.application.docId, application)
        .then(() => {
          this.isLoading = false;
          this.isEditing = false;
          this.noteForm.reset();
          this.initNoteForm();
        })
        .catch((error) => {
          console.error(error);
          this.isLoading = false;
          this.notificationService.showError('There was a problem updating the application. Please try again.');
        });
    }
  }

  private initNoteForm(): void {
    this.noteForm.setValue({
      note: this.application.note
    });
  }
}
