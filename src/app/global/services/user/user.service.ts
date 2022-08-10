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

import { Collections } from '~enums/collections.enum';
import { Themes } from '~enums/themes.enum';
import { JobBoard } from '~models/job-board.model';
import { JobBoardsService } from '~services/job-boards/job-boards.service';
import { UserStore } from '~store/user.store';
import { userDataConverter } from '~utils/firestore-converters';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private firestore: Firestore, private jobBoardsService: JobBoardsService, private userStore: UserStore) {}

  public async createExistingUserDoc(user: User): Promise<void> {
    const newBoard = await this.jobBoardsService.createJobBoard(user.uid);

    await updateDoc(doc(this.firestore, Collections.Users, user.uid), {
      appearance: Themes.System,
      currentJobBoard: newBoard.docId
    });
  }

  public async createUserDoc(user: User): Promise<void> {
    const newBoard = await this.jobBoardsService.createJobBoard(user.uid);

    await setDoc(doc(this.firestore, Collections.Users, user.uid), {
      appearance: Themes.System,
      currentJobBoard: newBoard.docId
    });
  }

  public async getUserDocSnap(uid: string): Promise<DocumentSnapshot<DocumentData>> {
    return await getDoc(doc(this.firestore, Collections.Users, uid).withConverter(userDataConverter));
  }

  public resetUserData(): void {
    this.userStore.appearance = null;
    this.userStore.currentJobBoard = null;
    this.userStore.uid = null;
  }

  public subscribeToUserDocData(uid: string): Unsubscribe {
    return onSnapshot(doc(this.firestore, Collections.Users, uid).withConverter(userDataConverter), (snapshot) => {
      this.userStore.appearance = snapshot.data()?.appearance ?? null;
      this.userStore.currentJobBoard = snapshot.data()?.currentJobBoard ?? null;
      this.userStore.uid = snapshot.data()?.uid ?? null;
    });
  }

  public async updateAppearance(value: Themes | string): Promise<void> {
    await updateDoc(doc(this.firestore, Collections.Users, this.userStore.uid!), {
      appearance: value
    });
  }

  public async updateCurrentJobBoard(newBoard: JobBoard): Promise<void> {
    await updateDoc(doc(this.firestore, Collections.Users, this.userStore.uid!), {
      currentJobBoard: newBoard.docId
    });
  }
}
