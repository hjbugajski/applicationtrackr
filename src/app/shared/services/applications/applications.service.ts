import { Injectable } from '@angular/core';
import { collection, CollectionReference, DocumentData, Firestore } from '@angular/fire/firestore';
import { filter, takeUntil } from 'rxjs';

import { Collections } from '~enums/collections.enum';
import { ApplicationDoc, ApplicationOffer } from '~interfaces/application-doc.interface';
import { Application } from '~models/application.model';
import { ColumnsService } from '~services/columns/columns.service';
import { FirestoreService } from '~services/firestore/firestore.service';
import { GlobalService } from '~services/global/global.service';
import { JobBoardsService } from '~services/job-boards/job-boards.service';
import { UserStore } from '~store/user.store';
import { applicationConverter } from '~utils/firestore-converters';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService extends FirestoreService<Application> {
  protected _basePath!: string;
  protected _collectionRef!: CollectionReference<DocumentData>;
  protected _collectionRefWithConverter!: CollectionReference<Application>;

  constructor(
    private columnsService: ColumnsService,
    protected firestore: Firestore,
    private globalService: GlobalService,
    private jobBoardsService: JobBoardsService,
    private userStore: UserStore
  ) {
    super(firestore);

    this.userStore.state$
      .pipe(
        takeUntil(this.globalService.destroy$),
        filter((state) => state.uid !== null && state.currentJobBoard !== null)
      )
      .subscribe((state) => {
        this._basePath = [
          Collections.Users,
          state.uid,
          Collections.JobBoards,
          state.currentJobBoard,
          Collections.Applications
        ].join('/');
        this._collectionRef = collection(this.firestore, this._basePath);
        this._collectionRefWithConverter = collection(this.firestore, this._basePath).withConverter(
          applicationConverter
        );
      });
  }

  public async createApplication(columnId: string, application: ApplicationDoc): Promise<void> {
    await this.create(application)
      .then(async () => {
        await this.updateTotals(columnId, 1);
      })
      .catch((error) => {
        throw error;
      });
  }

  public async deleteApplication(columnId: string, applicationId: string): Promise<void> {
    await this.delete(applicationId)
      .then(async () => {
        await this.updateTotals(columnId, -1);
      })
      .catch((error) => {
        throw error;
      });
  }

  public async moveApplication(prevColumnId: string, nextColumnId: string, applicationId: string): Promise<void> {
    await this.update(applicationId, { columnDocId: nextColumnId })
      .then(async () => {
        await this.columnsService.updateTotal(prevColumnId, -1);
        await this.columnsService.updateTotal(nextColumnId, 1);
      })
      .catch((error) => {
        throw error;
      });
  }

  public async updateApplication(applicationId: string, application: ApplicationDoc): Promise<void> {
    await this.update(applicationId, { ...application }).catch((error) => {
      throw error;
    });
  }

  public async updateApplicationOffer(applicationId: string, offer: ApplicationOffer): Promise<void> {
    await this.update(applicationId, { offer }).catch((error) => {
      throw error;
    });
  }

  private async updateTotals(columnId: string, value: number): Promise<void> {
    await this.columnsService.updateTotal(columnId, value);
    await this.jobBoardsService.updateJobBoardTotal(this.userStore.currentJobBoard!, value);
  }
}
