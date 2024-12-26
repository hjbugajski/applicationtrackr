import {
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

export type TagSize = 'regular' | 'small';
export type TagVariant = 'regular' | 'dropdown';

@Component({
  selector: 'at-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  host: {
    class: 'at-tag',
  },
  encapsulation: ViewEncapsulation.None,
})
export class TagComponent {
  @Input() @HostBinding('class') public color = 'neutral';
  @Output() public interaction: EventEmitter<undefined>;
  @Input() public size: TagSize = 'regular';
  @Input() public variant: TagVariant = 'regular';

  constructor() {
    this.interaction = new EventEmitter<undefined>();
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  public emitInteraction(event: KeyboardEvent): void {
    event.preventDefault();
    this.interaction.emit();
  }
}
