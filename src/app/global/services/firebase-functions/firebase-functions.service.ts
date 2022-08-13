import { Injectable } from '@angular/core';
import { Functions, httpsCallable, HttpsCallable } from '@angular/fire/functions';

import { Collections } from '~enums/collections.enum';
import { ReferenceTypes } from '~enums/reference-types.enum';
import { UserStore } from '~store/user.store';

@Injectable({
  providedIn: 'root'
})
export class FirebaseFunctionsService {
  private _batchDeleteApplications: HttpsCallable;
  private _recursiveDelete: HttpsCallable;

  constructor(private functions: Functions, private userStore: UserStore) {
    this._batchDeleteApplications = httpsCallable(this.functions, 'batchDeleteApplications');
    this._recursiveDelete = httpsCallable(this.functions, 'recursiveDelete');
  }

  public async batchDeleteApplications(columnDocId: string): Promise<any> {
    const path = `${Collections.JobBoards}/${this.userStore.currentJobBoard!}/${Collections.Applications}`;

    await this._batchDeleteApplications({ columnDocId, path }).catch((error) => {
      throw error;
    });
  }

  public async recursiveDelete(path: string, refType: ReferenceTypes): Promise<any> {
    await this._recursiveDelete({ path, refType }).catch((error) => {
      throw error;
    });
  }
}
