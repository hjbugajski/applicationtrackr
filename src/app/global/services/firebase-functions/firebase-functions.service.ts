import { Injectable } from '@angular/core';
import { Functions, httpsCallable, HttpsCallable } from '@angular/fire/functions';

import { ReferenceTypes } from '~enums/reference-types.enum';

@Injectable({
  providedIn: 'root'
})
export class FirebaseFunctionsService {
  private _recursiveDelete: HttpsCallable;

  constructor(private functions: Functions) {
    this._recursiveDelete = httpsCallable(this.functions, 'recursiveDelete');
  }

  public async recursiveDelete(path: string, refType: ReferenceTypes): Promise<any> {
    await this._recursiveDelete({ path, refType }).catch((error) => {
      throw error;
    });
  }
}
