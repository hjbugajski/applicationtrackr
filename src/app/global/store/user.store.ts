import { Injectable } from '@angular/core';
import { createStore, select, withProps } from '@ngneat/elf';

interface UserProps {
  user: { currentJobBoard: string | null; uid: string | null } | null;
}

const userStore = createStore({ name: 'user' }, withProps<UserProps>({ user: null }));

@Injectable({ providedIn: 'root' })
export class UserStore {
  public currentJobBoard$ = userStore.pipe(select((state) => state.user?.currentJobBoard ?? null));
  public user$ = userStore.pipe(select((state) => state.user));

  public get currentJobBoard(): string | null {
    return userStore.getValue().user?.currentJobBoard ?? null;
  }

  public set currentJobBoard(value: string | null) {
    userStore.update((state) => ({
      ...state,
      user: { currentJobBoard: value, uid: state.user?.uid ?? null }
    }));
  }

  public get uid(): string | null {
    return userStore.getValue().user?.uid ?? null;
  }

  public set uid(value: string | null) {
    userStore.update((state) => ({
      ...state,
      user: { currentJobBoard: state.user?.currentJobBoard ?? null, uid: value }
    }));
  }
}
