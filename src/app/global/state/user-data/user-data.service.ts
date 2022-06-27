import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import {
  doc,
  DocumentData,
  DocumentSnapshot,
  Firestore,
  getDoc,
  onSnapshot,
  setDoc,
  Unsubscribe,
  updateDoc
} from '@angular/fire/firestore';

import { UserDataQuery } from './user-data.query';
import { UserDataStore } from './user-data.store';

import { Collections } from '~enums/collections.enum';
import { JobBoard } from '~models/job-board.model';
import { JobBoardsService } from '~services/job-boards/job-boards.service';
import { userDataConverter } from '~utils/firestore-converters';

@Injectable({ providedIn: 'root' })
export class UserDataService {
  constructor(
    private firestore: Firestore,
    private jobBoardsService: JobBoardsService,
    private userDataQuery: UserDataQuery,
    private userDataStore: UserDataStore
  ) {}

  public async createUserDoc(user: User): Promise<void> {
    const newBoard = await this.jobBoardsService.createJobBoard(user.uid);

    await setDoc(doc(this.firestore, 'users', user.uid), {
      currentJobBoard: { date: newBoard.date, docId: newBoard.docId, title: newBoard.title }
    });
  }

  public async getUserDocSnap(uid: string): Promise<DocumentSnapshot<DocumentData>> {
    return await getDoc(doc(this.firestore, 'users', uid));
  }

  public resetUserData(): void {
    this.currentJobBoard = null;
    this.uid = null;
  }

  public subscribeToUserDocData(uid: string): Unsubscribe {
    return onSnapshot(doc(this.firestore, Collections.Users, uid).withConverter(userDataConverter), (snapshot) => {
      this.currentJobBoard = snapshot.data()?.currentJobBoard ?? null;
      this.uid = snapshot.data()?.uid ?? null;
    });
  }

  public async updateCurrentJobBoard(newBoard: JobBoard): Promise<void> {
    await updateDoc(doc(this.firestore, Collections.Users, this.userDataQuery.uid!), {
      currentJobBoard: { date: newBoard.date, docId: newBoard.docId, title: newBoard.title }
    });
  }

  public set currentJobBoard(value: JobBoard | null) {
    this.userDataStore.update({ currentJobBoard: value });
  }

  public set uid(value: string | null) {
    this.userDataStore.update({ uid: value });
  }
}
