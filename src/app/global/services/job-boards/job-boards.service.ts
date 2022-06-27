import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  DocumentData,
  DocumentReference,
  Firestore,
  orderBy,
  query
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Collections } from '~enums/collections.enum';
import { JobBoard } from '~models/job-board.model';
import { UserDataQuery } from '~state/user-data/user-data.query';
import { jobBoardConverter } from '~utils/firestore-converters';

@Injectable({
  providedIn: 'root'
})
export class JobBoardsService {
  public jobBoards: Observable<JobBoard[]>;

  constructor(private firestore: Firestore, private userDataQuery: UserDataQuery) {
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

  public initJobBoards(): void {
    this.jobBoards = collectionData(query(this.jobBoardCollection, orderBy('date')));
  }

  public resetJobBoards(): void {
    this.jobBoards = new Observable<JobBoard[]>();
  }

  private get jobBoardCollection(): CollectionReference<JobBoard> {
    return collection(this.firestore, Collections.Users, this.userDataQuery.uid!, Collections.JobBoards).withConverter(
      jobBoardConverter
    );
  }
}
