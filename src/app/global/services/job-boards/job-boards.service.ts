import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  orderBy,
  query,
  updateDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Collections } from '~enums/collections.enum';
import { JobBoard } from '~models/job-board.model';
import { NotificationService } from '~services/notification/notification.service';
import { UserDataQuery } from '~state/user-data/user-data.query';
import { jobBoardConverter } from '~utils/firestore-converters';

@Injectable({
  providedIn: 'root'
})
export class JobBoardsService {
  public jobBoards: Observable<JobBoard[]>;

  constructor(
    private firestore: Firestore,
    private notificationService: NotificationService,
    private userDataQuery: UserDataQuery
  ) {
    this.jobBoards = new Observable<JobBoard[]>();
  }

  public async createJobBoard(uid: string, title?: string, date?: Date): Promise<DocumentReference<DocumentData>> {
    if (!title && !date) {
      title = 'Job Board';
      date = new Date();
    }

    return await addDoc(collection(this.firestore, Collections.Users, uid, Collections.JobBoards), {
      date,
      title
    });
  }

  public async deleteJobBoard(docId: string): Promise<void> {
    await deleteDoc(doc(this.firestore, Collections.Users, this.userDataQuery.uid!, Collections.JobBoards, docId))
      .then(() => {
        this.notificationService.showSuccess('Job board deleted.');
      })
      .catch((error) => {
        console.error(error);
        this.notificationService.showError('There was a problem deleting the job board. Please try again.');
      });
  }

  public initJobBoards(): void {
    this.jobBoards = collectionData(query(this.jobBoardCollection, orderBy('date', 'desc')));
  }

  public resetJobBoards(): void {
    this.jobBoards = new Observable<JobBoard[]>();
  }

  public async updateJobBoard(data: JobBoard): Promise<void> {
    await updateDoc(
      doc(this.firestore, Collections.Users, this.userDataQuery.uid!, Collections.JobBoards, data.docId!),
      { date: data.date, title: data.title }
    ).catch((error) => {
      console.error(error);
      this.notificationService.showError('There was a problem updating the job board. Please try again.');
    });
  }

  private get jobBoardCollection(): CollectionReference<JobBoard> {
    return collection(this.firestore, Collections.Users, this.userDataQuery.uid!, Collections.JobBoards).withConverter(
      jobBoardConverter
    );
  }
}
