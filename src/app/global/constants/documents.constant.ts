import { ColumnDoc } from '~interfaces/column-doc.interface';

export const COLUMNS: ColumnDoc[] = [
  {
    applicationSort: {
      direction: 'asc',
      field: 'company'
    },
    color: 'neutral',
    sortOrder: 0,
    title: 'Todo',
    total: 0
  },
  {
    applicationSort: {
      direction: 'asc',
      field: 'company'
    },
    color: 'primary',
    sortOrder: 1,
    title: 'Submitted',
    total: 0
  },
  {
    applicationSort: {
      direction: 'asc',
      field: 'company'
    },
    color: 'accent',
    sortOrder: 2,
    title: 'Interview',
    total: 0
  },
  {
    applicationSort: {
      direction: 'asc',
      field: 'company'
    },
    color: 'success',
    sortOrder: 3,
    title: 'Offer',
    total: 0
  },
  {
    applicationSort: {
      direction: 'asc',
      field: 'company'
    },
    color: 'danger',
    sortOrder: 4,
    title: 'Rejected',
    total: 0
  }
];
