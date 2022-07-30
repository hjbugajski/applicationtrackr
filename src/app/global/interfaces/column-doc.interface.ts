import { Sort } from './sort.interface';

export interface ColumnDoc {
  applicationSort: Sort;
  color: string;
  sortOrder: number;
  title: string;
  total: number;
}
