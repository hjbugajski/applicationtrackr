import { ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';

import { DialogActions } from '~enums/dialog-actions.enum';
import { Application } from '~models/application.model';
import { Column } from '~models/column.model';
import { ApplicationsService } from '~services/applications/applications.service';
import { GlobalService } from '~services/global/global.service';
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
    private globalService: GlobalService,
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

    const dialogAction = await this.globalService.confirmationDialog({
      action: DialogActions.Discard,
      item: 'edits'
    });

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

      await this.applicationsService
        .update(this.application.docId, { note: this.note.value })
        .then(() => {
          this.isEditing = false;
          this.noteForm.reset();
          this.initNoteForm();
        })
        .catch((error) => {
          console.error(error);
          this.notificationService.showError('There was a problem updating the application. Please try again.');
        })
        .finally(() => (this.isLoading = false));
    }
  }

  private initNoteForm(): void {
    this.noteForm.setValue({
      note: this.application.note
    });
  }
}
