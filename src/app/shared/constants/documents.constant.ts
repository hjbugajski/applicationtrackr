import { ColumnDoc } from '~interfaces/column-doc.interface';

export const COLUMNS: ColumnDoc[] = [
  {
    applicationSort: {
      direction: 'asc',
      field: 'company',
    },
    color: 'neutral',
    sortOrder: 0,
    title: 'Todo',
  },
  {
    applicationSort: {
      direction: 'asc',
      field: 'company',
    },
    color: 'primary',
    sortOrder: 1,
    title: 'Submitted',
  },
  {
    applicationSort: {
      direction: 'asc',
      field: 'company',
    },
    color: 'accent',
    sortOrder: 2,
    title: 'Interview',
  },
  {
    applicationSort: {
      direction: 'asc',
      field: 'company',
    },
    color: 'success',
    sortOrder: 3,
    title: 'Offer',
  },
  {
    applicationSort: {
      direction: 'asc',
      field: 'company',
    },
    color: 'danger',
    sortOrder: 4,
    title: 'Rejected',
  },
];
