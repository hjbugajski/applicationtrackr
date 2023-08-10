import { Injectable } from '@angular/core';
import { collection, CollectionReference, DocumentData, Firestore } from '@angular/fire/firestore';
import { filter, takeUntil } from 'rxjs';

import { Collections } from '~enums/collections.enum';
import { ApplicationDoc } from '~interfaces/application-doc.interface';
import { Application } from '~models/application.model';
import { FirestoreService } from '~services/firestore/firestore.service';
import { GlobalService } from '~services/global/global.service';
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
    protected firestore: Firestore,
    private globalService: GlobalService,
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

  public async createApplication(application: ApplicationDoc): Promise<void> {
    await this.create(application).catch((error) => {
      throw error;
    });
  }

  public async deleteApplication(applicationId: string): Promise<void> {
    await this.delete(applicationId).catch((error) => {
      throw error;
    });
  }

  public async moveApplication(nextColumnId: string, applicationId: string): Promise<void> {
    await this.update(applicationId, { columnDocId: nextColumnId }).catch((error) => {
      throw error;
    });
  }
}
