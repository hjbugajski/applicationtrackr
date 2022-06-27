import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';

import { UserDataState, UserDataStore } from './user-data.store';

@Injectable({ providedIn: 'root' })
export class UserDataQuery extends QueryEntity<UserDataState> {
  private _currentJobBoard$ = this.select('currentJobBoard') as Observable<string>;

  constructor(protected store: UserDataStore) {
    super(store);
  }

  public get currentJobBoard(): string | null {
    return this.store.getValue().currentJobBoard as string | null;
  }

  public get currentJobBoard$(): Observable<string> {
    return this._currentJobBoard$;
  }

  public get uid(): string | null {
    return this.store.getValue().uid as string | null;
  }
}
