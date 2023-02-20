import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dss-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.scss'],
})
export class PackageDetailsComponent implements OnInit {
  // @Input() packageDetailsWidgetOptions?: OrderPackage = {};
  @Input() packageDetailsWidgetOptions?: any = {};
  @Input() packageCount: any;

  constructor() {}

  ngOnInit(): void {
    this.packageCount = this.packageCount + 1;
  }

  getOrderStatusPrefix(statusGroup: any): string {
    switch (statusGroup) {
      case 'Delivered':
        return 'deliveredon_TC';
        break;
      case 'Shipped':
        return 'arrivingon_TC';
        break;
      default:
        return 'estimatedDelivery_TC';
        break;
    }
  }

  getOrderWidgetStatusLabel(statusGroup: any): string {
    switch (statusGroup) {
      case 'PreparingToShip':
        return 'preparingToShip_SC';
        break;
      case 'Cancelled':
        return 'cancelled_TC';
        break;
      case 'BackOrdered':
        return 'processing_TC';
        break;
      case 'Returned':
        return 'returned_TC';
        break;
    }
  }
}
