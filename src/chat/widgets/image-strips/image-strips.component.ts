import { Component, Input, OnInit, OnChanges, SimpleChange } from '@angular/core';
import { ImageUrl } from '../../models/widget-format.model';

@Component({
  selector: 'dss-image-strips',
  templateUrl: './image-strips.component.html',
  styleUrls: ['./image-strips.component.scss']
})
export class ImageStripsComponent implements OnInit {
  @Input() imageStripWidgetOptions: any = [];
  widgetImageList: any = [];
  restImageCount: any;

  constructor() { }

  ngOnInit(): void {
    if (this.imageStripWidgetOptions && this.imageStripWidgetOptions.OrderLine?.length > 3) {
      this.widgetImageList = this.imageStripWidgetOptions.OrderLine.slice(0, 3);
      this.restImageCount = this.imageStripWidgetOptions.TotalCount - 3;
    }
    else {
      this.widgetImageList = this.imageStripWidgetOptions.OrderLine;
    }
  }

}
