import { Themes } from '~enums/themes.enum';

export interface UserSettings {
  appearance: Themes | string | null;
  collapseColumns: boolean | null;
}

export interface UserDoc {
  currentJobBoard: string | null;
  settings: UserSettings | null;
}
