import { Injectable } from '@angular/core';
import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  Firestore,
  getCountFromServer,
  orderBy,
  query,
  writeBatch
} from '@angular/fire/firestore';
import { Observable, takeUntil } from 'rxjs';

import { COLUMNS } from '~constants/documents.constant';
import { Collections } from '~enums/collections.enum';
import { ReferenceTypes } from '~enums/reference-types.enum';
import { JobBoardDoc } from '~interfaces/job-board-doc.interface';
import { JobBoard } from '~models/job-board.model';
import { FirebaseFunctionsService } from '~services/firebase-functions/firebase-functions.service';
import { FirestoreService } from '~services/firestore/firestore.service';
import { GlobalService } from '~services/global/global.service';
import { NotificationService } from '~services/notification/notification.service';
import { UserStore } from '~store/user.store';
import { dateToTimestamp } from '~utils/date.util';
import { jobBoardConverter } from '~utils/firestore-converters';

@Injectable({
  providedIn: 'root'
})
export class JobBoardsService extends FirestoreService<JobBoard> {
  public jobBoards$: Observable<JobBoard[]>;

  protected _basePath!: string;
  protected _collectionRef!: CollectionReference<DocumentData>;
  protected _collectionRefWithConverter!: CollectionReference<JobBoard>;

  constructor(
    private firebaseFunctionsService: FirebaseFunctionsService,
    protected firestore: Firestore,
    private globalService: GlobalService,
    private notificationService: NotificationService,
    private userStore: UserStore
  ) {
    super(firestore);

    this.jobBoards$ = new Observable<JobBoard[]>();
    this.userStore.uid$.pipe(takeUntil(this.globalService.destroy$)).subscribe((uid) => {
      if (uid) {
        this._basePath = [Collections.Users, uid, Collections.JobBoards].join('/');
        this._collectionRef = collection(this.firestore, this._basePath);
        this._collectionRefWithConverter = collection(this.firestore, this._basePath).withConverter(jobBoardConverter);

        this.resetJobBoards();
        this.jobBoards$ = this.collection$(query(this.collectionRefWithConverter, orderBy('date', 'desc')));
      } else {
        this.resetJobBoards();
      }
    });
  }

  public async createColumns(uid: string, boardId: string): Promise<void> {
    const batch = writeBatch(this.firestore);
    const collectionRef = collection(
      this.firestore,
      Collections.Users,
      uid,
      Collections.JobBoards,
      boardId,
      Collections.Columns
    );

    for (let i = 0; i < COLUMNS.length; i++) {
      batch.set(doc(collectionRef), COLUMNS[i]);
    }

    await batch.commit();
  }

  public async createJobBoard(
    uid: string,
    value: JobBoardDoc = { title: 'Job Board', date: dateToTimestamp(new Date(Date.now())) }
  ): Promise<string> {
    const docRef = await this.create(value);

    await this.createColumns(uid, docRef.id);

    return docRef.id;
  }

  public async deleteJobBoard(docId: string): Promise<void> {
    await this.firebaseFunctionsService
      .recursiveDelete(`${Collections.JobBoards}/${docId}`, ReferenceTypes.Doc)
      .then(() => this.notificationService.showSuccess('Job board deleted.'))
      .catch(() => this.notificationService.showError('There was a problem deleting the job board. Please try again.'));
  }

  public async getApplicationsTotal(id: string): Promise<number> {
    const basePath = [this._basePath, id, Collections.Applications].join('/');
    const snapshot = await getCountFromServer(collection(this.firestore, basePath));

    return snapshot.data().count;
  }

  private resetJobBoards(): void {
    this.jobBoards$ = new Observable<JobBoard[]>();
  }
}
