import { Injectable } from '@angular/core';
import { WhereFilterOp } from '@angular/fire/firestore';
import { Functions, httpsCallable, HttpsCallable } from '@angular/fire/functions';

import { Collections } from '~enums/collections.enum';
import { ReferenceTypes } from '~enums/reference-types.enum';
import { UserStore } from '~store/user.store';

@Injectable({
  providedIn: 'root',
})
export class FirebaseFunctionsService {
  private _batchDelete: HttpsCallable;
  private _recursiveDelete: HttpsCallable;

  constructor(
    private functions: Functions,
    private userStore: UserStore,
  ) {
    this._batchDelete = httpsCallable(this.functions, 'batchDelete');
    this._recursiveDelete = httpsCallable(this.functions, 'recursiveDelete');
  }

  public async batchDeleteApplications(columnDocId: string): Promise<any> {
    const path = `${Collections.JobBoards}/${this.userStore.currentJobBoard!}/${Collections.Applications}`;
    const operator: WhereFilterOp = '==';

    await this._batchDelete({ field: 'columnDocId', operator, path, value: columnDocId }).catch(
      (error) => {
        throw error;
      },
    );
  }

  public async recursiveDelete(path: string, refType: ReferenceTypes): Promise<any> {
    await this._recursiveDelete({ path, refType }).catch((error) => {
      throw error;
    });
  }
}
