import { Component, Input, OnInit } from '@angular/core';
import { OrderHeaderWidget } from '../../models/widget-format.model';


@Component({
  selector: 'dss-widget-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() headerWidgetOptions: OrderHeaderWidget = {};
  @Input() conversationid: any;
  @Input() token: any;
  @Input() orgId: any;

  constructor() { }
  ngOnInit(): void {}

  getTrackingUrl(btnUrl: any): any {
    if (this.conversationid && this.token) {
      if (btnUrl) {
        return btnUrl + '&conversationId=' + this.conversationid + '&chatToken=' + this.token + '&orgId=' + this.orgId;
      }
    }
    return btnUrl;
  }
}
