import { Component, Input, OnInit } from '@angular/core';
import { OrderPackage } from '../../models/widget-format.model';
import { TranslatePipe } from 'src/app/core/pipes/translate/translate.pipe';

@Component({
  selector: 'dss-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.scss']
})
export class PackageDetailsComponent implements OnInit {
  // @Input() packageDetailsWidgetOptions?: OrderPackage = {};
  @Input() packageDetailsWidgetOptions?: any = {};
  @Input() packageCount: any;

  constructor(private translatePipe: TranslatePipe) { }

  ngOnInit(): void {
    this.packageCount  = this.packageCount + 1;
  }

  getOrderStatusPrefix(statusGroup: any): void {
    switch (statusGroup) {
      case 'Delivered':
        return this.translatePipe.transform('deliveredon_TC');
        break;
      case 'Shipped':
        return this.translatePipe.transform('arrivingon_TC');
        break;
      default:
        return this.translatePipe.transform('estimatedDelivery_TC');
        break;
    }
  }

  getOrderWidgetStatusLabel(statusGroup: any): void {
    switch (statusGroup) {
      case 'PreparingToShip':
        return this.translatePipe.transform('preparingToShip_SC');
        break;
      case 'Cancelled':
        return this.translatePipe.transform('cancelled_TC');
        break;
      case 'BackOrdered':
        return this.translatePipe.transform('processing_TC');
        break;
      case 'Returned':
        return this.translatePipe.transform('returned_TC');
        break;
    }
  }
}
