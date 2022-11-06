import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentData,
  Firestore,
  increment,
  orderBy,
  query,
  writeBatch
} from '@angular/fire/firestore';
import { Observable, takeUntil } from 'rxjs';

import { COLUMNS } from '~constants/documents.constant';
import { Collections } from '~enums/collections.enum';
import { ReferenceTypes } from '~enums/reference-types.enum';
import { JobBoard } from '~models/job-board.model';
import { FirebaseFunctionsService } from '~services/firebase-functions/firebase-functions.service';
import { FirestoreService } from '~services/firestore/firestore.service';
import { GlobalService } from '~services/global/global.service';
import { NotificationService } from '~services/notification/notification.service';
import { UserStore } from '~store/user.store';
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
    this.userStore.state$.pipe(takeUntil(this.globalService.destroy$)).subscribe((state) => {
      if (state.uid) {
        this._basePath = [Collections.Users, state.uid, Collections.JobBoards].join('/');
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

  public async createJobBoard(uid: string, title?: string, date?: Date): Promise<string> {
    const collectionRef = collection(this.firestore, Collections.Users, uid, Collections.JobBoards);
    const docRef = await addDoc(collectionRef, {
      date: date ?? new Date(),
      title: title ?? 'Job Board',
      total: 0
    });

    await this.createColumns(uid, docRef.id);

    return docRef.id;
  }

  public async deleteJobBoard(docId: string): Promise<void> {
    await this.firebaseFunctionsService
      .recursiveDelete(`${Collections.JobBoards}/${docId}`, ReferenceTypes.Doc)
      .then(() => {
        this.notificationService.showSuccess('Job board deleted.');
      })
      .catch((error) => {
        console.error(error);
        this.notificationService.showError('There was a problem deleting the job board. Please try again.');
      });
  }

  public async updateJobBoard(id: string, data: Partial<JobBoard>): Promise<void> {
    await this.update(id, data).catch((error) => {
      console.error(error);
      this.notificationService.showError('There was a problem updating the job board. Please try again.');
    });
  }

  public async updateJobBoardTotal(id: string, value: number): Promise<void> {
    await this.update(id, { total: increment(value) }).catch((error) => {
      console.error(error);
    });
  }

  private resetJobBoards(): void {
    this.jobBoards$ = new Observable<JobBoard[]>();
  }
}
