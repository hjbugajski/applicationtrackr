import { Colors } from '~enums/colors.enum';
import { SortOption } from '~interfaces/sort-option.interface';

export const COLUMN_SORT_OPTIONS: SortOption[] = [
  {
    value: {
      direction: 'asc',
      field: 'company',
    },
    viewValue: 'Company A-Z',
  },
  {
    value: {
      direction: 'desc',
      field: 'company',
    },
    viewValue: 'Company Z-A',
  },
  {
    value: {
      direction: 'asc',
      field: 'position',
    },
    viewValue: 'Position A-Z',
  },
  {
    value: {
      direction: 'desc',
      field: 'position',
    },
    viewValue: 'Position Z-A',
  },
  {
    value: {
      direction: 'desc',
      field: 'date',
    },
    viewValue: 'Date newest',
  },
  {
    value: {
      direction: 'asc',
      field: 'date',
    },
    viewValue: 'Date oldest',
  },
];

export const COLOR_OPTIONS = [
  {
    value: Colors.Neutral,
    viewValue: 'Neutral',
  },
  {
    value: Colors.Primary,
    viewValue: 'Blue',
  },
  {
    value: Colors.Accent,
    viewValue: 'Purple',
  },
  {
    value: Colors.AccentAlt,
    viewValue: 'Pink',
  },
  {
    value: Colors.Success,
    viewValue: 'Green',
  },
  {
    value: Colors.Attention,
    viewValue: 'Yellow',
  },
  {
    value: Colors.Severe,
    viewValue: 'Orange',
  },
  {
    value: Colors.SevereAlt,
    viewValue: 'Coral',
  },
  {
    value: Colors.Danger,
    viewValue: 'Red',
  },
];

export const PAY_PERIOD_OPTIONS = ['hour', 'week', 'month', 'year', 'total'];
