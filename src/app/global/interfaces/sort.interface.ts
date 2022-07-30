import { OrderByDirection } from 'firebase/firestore';

export interface Sort {
  direction: OrderByDirection;
  field: string;
}
