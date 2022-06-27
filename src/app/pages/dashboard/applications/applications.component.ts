import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { TITLE_SUFFIX } from '~constants/title.constant';

@Component({
  selector: 'at-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationsComponent {
  public columns = ['Todo', 'In progress', 'Submitted', 'Interview'];
  public items = Array.from({ length: 50 }).map((_, i) => i);

  constructor(private titleService: Title) {
    this.titleService.setTitle('Applications' + TITLE_SUFFIX);
  }
}
