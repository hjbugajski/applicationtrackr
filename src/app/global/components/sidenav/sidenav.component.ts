import { Component } from '@angular/core';
import {
  CARBON_APPLICATION,
  CARBON_EMAIL,
  CARBON_CHART_MULTITYPE,
  CARBON_TEMPLATE
} from '../../constants/icons.constants';
import { ANALYTICS, APPLICATIONS, OFFERS, JOB_BOARDS } from '../../constants/pages.constants';

interface SidenavItem {
  icon: string;
  viewValue: string;
}

@Component({
  selector: 'at-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  public title = 'ApplicationTrackr';
  public sidenavItems: SidenavItem[] = [
    {
      icon: CARBON_APPLICATION.NAME,
      viewValue: APPLICATIONS.VIEW_VALUE
    },
    {
      icon: CARBON_EMAIL.NAME,
      viewValue: OFFERS.VIEW_VALUE
    },
    {
      icon: CARBON_CHART_MULTITYPE.NAME,
      viewValue: ANALYTICS.VIEW_VALUE
    },
    {
      icon: CARBON_TEMPLATE.NAME,
      viewValue: JOB_BOARDS.VIEW_VALUE
    }
  ];
}
