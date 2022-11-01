import { Injectable } from '@angular/core';
import { createStore, select, setProps, withProps } from '@ngneat/elf';

import { Themes } from '~enums/themes.enum';
import { UserSettings } from '~interfaces/user-doc.interface';

interface UserProps {
  currentJobBoard: string | null;
  settings: UserSettings;
  uid: string | null;
}

const userStore = createStore(
  { name: 'user' },
  withProps<UserProps>({
    settings: {
      appearance: null,
      collapseColumns: null
    },
    currentJobBoard: null,
    uid: null
  })
);

@Injectable({ providedIn: 'root' })
export class UserStore {
  public appearance$ = userStore.pipe(select((state) => state.settings.appearance));
  public collapseColumns$ = userStore.pipe(select((state) => state.settings.collapseColumns));
  public currentJobBoard$ = userStore.pipe(select((state) => state.currentJobBoard));
  public uid$ = userStore.pipe(select((state) => state.uid));
  public user$ = userStore.pipe(select((state) => state));

  public get appearance(): Themes | string | null {
    return userStore.getValue().settings.appearance;
  }

  public set appearance(value: Themes | string | null) {
    userStore.update(
      setProps((state) => ({
        ...state,
        settings: {
          ...state.settings,
          appearance: value
        }
      }))
    );
  }

  public get collapseColumns(): boolean | null {
    return userStore.getValue().settings.collapseColumns;
  }

  public set collapseColumns(value: boolean | null) {
    userStore.update(
      setProps((state) => ({
        ...state,
        settings: {
          ...state.settings,
          collapseColumns: value
        }
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
