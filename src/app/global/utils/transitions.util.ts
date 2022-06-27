import { animate, state, style, transition, trigger } from '@angular/animations';

export const expandCollapse = trigger('expandCollapse', [
  state('collapsed, void', style({ height: '0', minHeight: '0' })),
  state('expanded', style({ height: '*' })),
  transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.5, 0, 0.5, 1)'))
]);

export const ngIfAnimation = trigger('ngIfAnimation', [
  transition(':enter', [style({ height: '*' }), animate('225ms')]),
  transition(':leave', [style({ height: '0px', minHeight: '0px' }), animate('225ms')])
]);
