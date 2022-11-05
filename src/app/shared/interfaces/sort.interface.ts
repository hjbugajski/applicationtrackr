import { OrderByDirection } from '@angular/fire/firestore';

export interface Sort {
  direction: OrderByDirection;
  field: string;
}
