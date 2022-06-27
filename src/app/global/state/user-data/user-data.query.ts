import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';

import { UserDataState, UserDataStore } from './user-data.store';

import { JobBoard } from '~models/job-board.model';

@Injectable({ providedIn: 'root' })
export class UserDataQuery extends QueryEntity<UserDataState> {
  private _currentJobBoard$ = this.select('currentJobBoard') as Observable<JobBoard>;

  constructor(protected store: UserDataStore) {
    super(store);
  }

  public get currentJobBoard(): JobBoard | null {
    return this.store.getValue().currentJobBoard as JobBoard | null;
  }

  public get currentJobBoard$(): Observable<JobBoard> {
    return this._currentJobBoard$;
  }

  public get uid(): string | null {
    return this.store.getValue().uid as string | null;
  }
}
