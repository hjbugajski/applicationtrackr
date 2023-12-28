import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Firestore, getDocs, writeBatch } from '@angular/fire/firestore';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { COLOR_OPTIONS } from '~constants/forms.constants';
import { DialogActions } from '~enums/dialog-actions.enum';
import { ColumnDoc } from '~interfaces/column-doc.interface';
import { DocumentDialog } from '~interfaces/document-dialog.interface';
import { Column } from '~models/column.model';
import { ColumnsService } from '~services/columns/columns.service';
import { GlobalService } from '~services/global/global.service';
import { NotificationService } from '~services/notification/notification.service';

@Component({
  selector: 'at-column-dialog',
  templateUrl: './column-dialog.component.html',
  styleUrls: ['./column-dialog.component.scss'],
})
export class ColumnDialogComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChildren('reorderItem') reorderItems!: QueryList<ElementRef<HTMLElement>>;

  public action: DialogActions | string;
  public colorOptions = COLOR_OPTIONS;
  public columnForm = new FormGroup({
    color: new FormControl<string | null>(null, [Validators.required]),
    title: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(128)]),
  });
  public columns: Column[] = [];
  public isLoading: boolean;
  public isReordered: boolean;

  private activeReorderItem = 0;
  private subscription: Subscription | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public providedData: DocumentDialog<Column>,
    private columnsService: ColumnsService,
    private firestore: Firestore,
    private globalService: GlobalService,
    private matDialogRef: MatDialogRef<ColumnDialogComponent>,
    private notificationService: NotificationService,
  ) {
    this.action = this.providedData.action;
    this.isLoading = false;
    this.isReordered = false;

    this.initForm();
  }

  public get color(): AbstractControl<string | null> {
    return this.columnForm.controls.color;
  }

  public get dialogActions(): typeof DialogActions {
    return DialogActions;
  }

  public get title(): AbstractControl<string | null> {
    return this.columnForm.controls.title;
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    this.activeReorderItem = event.currentIndex;
    this.isReordered = true;
    this.setFocus();
  }

  public async formClose(): Promise<void> {
    if (this.columnForm.pristine) {
      this.matDialogRef.close();
    } else {
      const dialogAction = await this.globalService.confirmationDialog({
        action: DialogActions.Discard,
        item: this.providedData.action === DialogActions.New ? 'column' : 'edits',
      });

      if (dialogAction === DialogActions.Discard) {
        this.matDialogRef.close();
      }
    }
  }

  public getError(control: AbstractControl): string {
    if (control.hasError('maxlength')) {
      return 'Length must be less than 128';
    } else {
      return 'Required';
    }
  }

  public handleListKeyDown(event: KeyboardEvent, fromIndex: number): void {
    let toIndex = fromIndex;

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      toIndex = fromIndex + 1;
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      toIndex = fromIndex - 1;
    }

    moveItemInArray(this.columns, fromIndex, toIndex);
    this.activeReorderItem = toIndex;
    this.isReordered = true;
    this.setFocus();
  }

  ngAfterViewInit(): void {
    this.subscription = this.reorderItems.changes.subscribe(() => this.setFocus());
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  async ngOnInit(): Promise<void> {
    await getDocs(this.columnsService.query).then((v) => (this.columns = v.docs.map((doc) => doc.data())));
  }

  public reorderClose(): void {
    this.matDialogRef.close();
  }

  public async submit(): Promise<void> {
    if (this.columnForm.invalid) {
      return;
    }

    this.isLoading = true;

    const color = this.color.value!;
    const title = this.title.value!;

    if (this.providedData.action === DialogActions.New) {
      await this.createColumn(color, title);
    } else {
      // DialogActions.Edit
      await this.updateColumn(color, title);
    }
  }

  public async submitReorder(): Promise<void> {
    this.isLoading = true;

    const batch = writeBatch(this.firestore);

    this.columns.forEach((column, i) => {
      batch.update(this.columnsService.docRef(column.docId), { sortOrder: i });
    });

    await batch
      .commit()
      .then(() => this.matDialogRef.close())
      .catch(() => this.notificationService.showError('There was an error reordering the columns. Please try again.'))
      .finally(() => (this.isLoading = false));
  }

  private async createColumn(color: string, title: string): Promise<void> {
    const columnDoc: ColumnDoc = {
      applicationSort: {
        direction: 'asc',
        field: 'company',
      },
      color,
      sortOrder: this.columns.length,
      title,
    };

    await this.columnsService
      .create(columnDoc)
      .then(() => {
        this.notificationService.showSuccess('Column added!');
        this.matDialogRef.close();
      })
      .catch(() => this.notificationService.showError('There was an error adding the column. Please try again.'))
      .finally(() => (this.isLoading = false));
  }

  private initForm(): void {
    const data = this.providedData.data;

    if (this.providedData.action === DialogActions.Edit) {
      this.color.patchValue(data.color ?? null);
      this.title.patchValue(data.title);
    }
  }

  private setFocus() {
    this.reorderItems.get(this.activeReorderItem)?.nativeElement.focus();
  }

  private async updateColumn(color: string, title: string): Promise<void> {
    const data = this.providedData.data;

    await this.columnsService
      .update(data.docId, { color, title })
      .then(() => this.matDialogRef.close())
      .catch(() => this.notificationService.showError('There was an error updating the column. Please try again.'))
      .finally(() => (this.isLoading = false));
  }
}
