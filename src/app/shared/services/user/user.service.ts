import { Injectable } from '@angular/core';
import { User as FireAuthUser } from '@angular/fire/auth';
import { collection, CollectionReference, DocumentData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { Subscription, takeUntil } from 'rxjs';

import { Collections } from '~enums/collections.enum';
import { Themes } from '~enums/themes.enum';
import { User } from '~models/user.model';
import { FirestoreService } from '~services/firestore/firestore.service';
import { GlobalService } from '~services/global/global.service';
import { JobBoardsService } from '~services/job-boards/job-boards.service';
import { UserStore } from '~store/user.store';
import { userConverter } from '~utils/firestore-converters';

@Injectable({ providedIn: 'root' })
export class UserService extends FirestoreService<User> {
  protected _basePath: string;
  protected _collectionRef: CollectionReference<DocumentData>;
  protected _collectionRefWithConverter: CollectionReference<User>;

  private userDocSubscription: Subscription | undefined;

  constructor(
    protected firestore: Firestore,
    private globalService: GlobalService,
    private jobBoardsService: JobBoardsService,
    private userStore: UserStore,
  ) {
    super(firestore);

    this._basePath = Collections.Users;
    this._collectionRef = collection(this.firestore, this._basePath);
    this._collectionRefWithConverter = collection(this.firestore, this._basePath).withConverter(userConverter);

    this.userStore.uid$.pipe(takeUntil(this.globalService.destroy$)).subscribe((uid) => {
      this.userDocSubscription?.unsubscribe();

      if (uid) {
        this.userDocSubscription = this.doc$(uid, userConverter)
          .pipe(takeUntil(this.globalService.destroy$))
          .subscribe((doc) => {
            this.userStore.update({
              appearance: doc.settings?.appearance ?? null,
              collapseColumns: doc.settings?.collapseColumns ?? null,
              currentJobBoard: doc.currentJobBoard,
            });
          });
      }
    });
  }

  public async createExistingUserDoc(user: FireAuthUser): Promise<void> {
    const docId = await this.jobBoardsService.createJobBoard(user.uid);

    await updateDoc(this.docRef(user.uid), {
      currentJobBoard: docId,
      settings: {
        appearance: Themes.System,
        collapseColumns: false,
      },
    });
  }

  public async createUserDoc(user: FireAuthUser): Promise<void> {
    const docId = await this.jobBoardsService.createJobBoard(user.uid);

    await setDoc(this.docRef(user.uid), {
      currentJobBoard: docId,
      settings: {
        appearance: Themes.System,
        collapseColumns: false,
      },
    });
  }

  public async updateAppearance(value: Themes | string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await this.update(this.userStore.uid!, { 'settings.appearance': value });
  }

  public async updateCollapseColumns(value: boolean): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await this.update(this.userStore.uid!, { 'settings.collapseColumns': value });
  }
}
