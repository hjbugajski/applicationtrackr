import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { getDocs } from '@angular/fire/firestore';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';

import { ConfirmationDialogComponent } from '~components/confirmation-dialog/confirmation-dialog.component';
import { COLOR_OPTIONS } from '~constants/forms.constants';
import { DialogActions } from '~enums/dialog-actions.enum';
import { ColumnDoc } from '~interfaces/column-doc.interface';
import { ConfirmationDialog } from '~interfaces/confirmation-dialog.interface';
import { DocumentDialog } from '~interfaces/document-dialog.interface';
import { Column } from '~models/column.model';
import { ColumnsService } from '~services/columns/columns.service';
import { GlobalService } from '~services/global/global.service';
import { NotificationService } from '~services/notification/notification.service';

@Component({
  selector: 'at-column-dialog',
  templateUrl: './column-dialog.component.html',
  styleUrls: ['./column-dialog.component.scss']
})
export class ColumnDialogComponent implements AfterViewInit, OnInit {
  @ViewChildren('reorderItem') reorderItems!: QueryList<ElementRef<HTMLElement>>;

  public action: DialogActions | string;
  public colorOptions = COLOR_OPTIONS;
  public columnForm = new FormGroup({
    color: new FormControl<string | null>(null, [Validators.required]),
    title: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(128)])
  });
  public columns: Column[] = [];
  public isLoaded: BehaviorSubject<boolean>;
  public isLoading: boolean;
  public isReordered: boolean;

  private activeReorderItem = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public providedData: DocumentDialog,
    private columnsService: ColumnsService,
    private globalService: GlobalService,
    private matDialog: MatDialog,
    private matDialogRef: MatDialogRef<ColumnDialogComponent>,
    private notificationService: NotificationService
  ) {
    this.action = this.providedData.action;
    this.isLoaded = new BehaviorSubject<boolean>(false);
    this.isLoading = false;
    this.isReordered = false;

    this.initForm();
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
      const data: ConfirmationDialog = {
        action: DialogActions.Discard,
        item: this.providedData.action === DialogActions.New ? 'column' : 'edits'
      };
      const dialogAfterClosed = this.matDialog
        .open(ConfirmationDialogComponent, {
          autoFocus: false,
          data,
          disableClose: true,
          width: '315px',
          panelClass: 'at-dialog-with-padding'
        })
        .afterClosed() as Observable<DialogActions>;

      if ((await lastValueFrom(dialogAfterClosed)) === DialogActions.Discard) {
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
    this.reorderItems.changes.subscribe(() => {
      this.setFocus();
    });
  }

  async ngOnInit(): Promise<void> {
    await getDocs(this.columnsService.query).then((snapshot) => {
      this.columns = snapshot.docs.map((doc) => doc.data());
      this.isLoaded.next(true);
    });
  }

  public reorderClose(): void {
    this.matDialogRef.close();
  }

  public async submit(): Promise<void> {
    if (this.columnForm.valid) {
      this.isLoading = true;

      const color = this.color.value!;
      const title = this.title.value!;

      if (this.providedData.action === DialogActions.New) {
        const columnDoc: ColumnDoc = {
          applicationSort: {
            direction: 'asc',
            field: 'company'
          },
          color,
          sortOrder: this.columns.length,
          title,
          total: 0
        };

        await this.columnsService.createColumn(columnDoc).then(() => {
          this.globalService.reloadColumns$.emit();
          this.isLoading = false;
          this.notificationService.showSuccess('Column added!');
          this.matDialogRef.close();
        });
      } else {
        // DialogActions.Edit
        const data = this.providedData.data as Column;
        const columnDoc: ColumnDoc = {
          applicationSort: data.applicationSort,
          color,
          sortOrder: data.sortOrder,
          title,
          total: data.total
        };

        await this.columnsService.updateColumn(data.docId, columnDoc).then(() => {
          this.isLoading = false;
          this.matDialogRef.close();
        });
      }
    }
  }

  public async submitReorder(): Promise<void> {
    this.isLoading = true;

    try {
      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i].sortOrder !== i) {
          await this.columnsService.updateSortOrder(this.columns[i].docId, i);
        }
      }
    } catch (error) {
      console.error(error);
      this.notificationService.showError('There was an error reordering the columns. Please try again.');
    } finally {
      this.isLoading = false;
      this.globalService.reloadColumns$.emit();
      this.matDialogRef.close();
    }
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

  private initForm(): void {
    const data = this.providedData.data as Column;

    if (this.providedData.action === DialogActions.Edit) {
      this.color.patchValue(data.color ?? null);
      this.title.patchValue(data.title);
    }
  }

  private setFocus() {
    this.reorderItems.get(this.activeReorderItem)?.nativeElement.focus();
  }
}
