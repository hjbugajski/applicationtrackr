import { Themes } from '~enums/themes.enum';

export interface UserDoc {
  appearance: Themes | string | null;
  currentJobBoard: string | null;
}
