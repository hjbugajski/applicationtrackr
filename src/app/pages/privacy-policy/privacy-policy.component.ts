import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'at-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {
  constructor(private location: Location) {}

  public goBack(): void {
    this.location.back();
  }
}
