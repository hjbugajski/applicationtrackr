import { Injectable } from '@angular/core';
import { createStore, select, setProps, withProps } from '@ngneat/elf';

import { Themes } from '~enums/themes.enum';

interface UserProps {
  appearance: Themes | string | null;
  currentJobBoard: string | null;
  uid: string | null;
}

const userStore = createStore(
  { name: 'user' },
  withProps<UserProps>({ appearance: null, currentJobBoard: null, uid: null })
);

@Injectable({ providedIn: 'root' })
export class UserStore {
  public appearance$ = userStore.pipe(select((state) => state.appearance));
  public currentJobBoard$ = userStore.pipe(select((state) => state.currentJobBoard));
  public uid$ = userStore.pipe(select((state) => state.uid));
  public user$ = userStore.pipe(select((state) => state));

  public get appearance(): Themes | string | null {
    return userStore.getValue().appearance;
  }

  public set appearance(value: Themes | string | null) {
    userStore.update(
      setProps(() => ({
        appearance: value
      }))
    );
  }

  public get currentJobBoard(): string | null {
    return userStore.getValue().currentJobBoard;
  }

  public set currentJobBoard(value: string | null) {
    userStore.update(
      setProps(() => ({
        currentJobBoard: value
      }))
    );
  }

  public get uid(): string | null {
    return userStore.getValue().uid;
  }

  public set uid(value: string | null) {
    userStore.update(
      setProps(() => ({
        uid: value
      }))
    );
  }
}
