/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable @angular-eslint/no-host-metadata-property */
import { Component, Directive, Input, ViewEncapsulation } from '@angular/core';

export type ToolbarVariant = 'ghost' | 'regular';

@Component({
  selector: 'at-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  host: {
    class: 'at-toolbar',
    '[class.at-toolbar-fixed]': 'fixed',
    '[class.at-toolbar-ghost]': "variant === 'ghost'"
  },
  encapsulation: ViewEncapsulation.None
})
export class ToolbarComponent {
  @Input() public fixed = false;
  @Input() public variant: ToolbarVariant = 'regular';
}

@Directive({
  selector: 'at-toolbar-spacer, [at-toolbar-spacer]',
  host: {
    class: 'at-toolbar-spacer'
  }
})
export class ToolbarSpacerDirective {}

@Directive({
  selector: 'at-toolbar-title, [at-toolbar-title]',
  host: {
    class: 'at-toolbar-title'
  }
})
export class ToolbarTitleDirective {}
