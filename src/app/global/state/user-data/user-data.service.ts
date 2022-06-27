import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import {
  doc,
  docData,
  DocumentData,
  DocumentSnapshot,
  Firestore,
  getDoc,
  setDoc,
  updateDoc
} from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

import { UserData } from './user-data.model';
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
    const currentJobBoard = (await this.jobBoardsService.createJobBoard(user.uid)).id;

    await setDoc(doc(this.firestore, 'users', user.uid), {
      currentJobBoard
    });
  }

  public async getUserDocSnap(uid: string): Promise<DocumentSnapshot<DocumentData>> {
    return await getDoc(doc(this.firestore, 'users', uid));
  }

  public resetUserData(): void {
    this.currentJobBoard = null;
    this.uid = null;
  }

  public subscribeToUserDocData(uid: string): Subscription {
    return docData(doc(this.firestore, Collections.Users, uid).withConverter(userDataConverter)).subscribe(
      (data: UserData) => {
        this.currentJobBoard = data.currentJobBoard;
        this.uid = data.uid;
      }
    );
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
