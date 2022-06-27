import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

import { UserData } from './user-data.model';

export type UserDataState = EntityState<UserData>;

export function createInitialState(): UserData {
  return {
    currentJobBoard: null,
    uid: null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'user-data' })
export class UserDataStore extends EntityStore<UserDataState> {
  constructor() {
    super(createInitialState());
  }
}
