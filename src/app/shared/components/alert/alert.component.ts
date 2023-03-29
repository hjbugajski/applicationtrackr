import { Component, HostBinding, Input } from '@angular/core';

import { Colors } from '~enums/colors.enum';

@Component({
  selector: 'at-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  host: {
    class: 'at-alert at-border at-alpha-background'
  }
})
export class AlertComponent {
  @Input() @HostBinding('class') public color: Colors | string = Colors.Primary;
}
