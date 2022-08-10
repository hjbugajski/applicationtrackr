import { Component, Input } from '@angular/core';

import { Colors } from '~enums/colors.enum';

@Component({
  selector: 'at-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  @Input() public color: Colors | string = Colors.Primary;
}
