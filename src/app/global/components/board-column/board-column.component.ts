import { Component, Input } from '@angular/core';

import { Column } from '~models/column.model';

@Component({
  selector: 'at-board-column',
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.scss']
})
export class BoardColumnComponent {
  @Input() public column: Column | undefined;
  public applications = Array.from({ length: 10 }).map((_, i) => i);
}
