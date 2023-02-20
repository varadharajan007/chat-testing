import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dss-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.scss'],
})
export class PackageListComponent implements OnInit {
  @Input() packageListWidgetOptions: any = [];
  @Input() totalpackageCount: any;
  remainingCount: any = 0;
  packageGroupList: any = [];
  constructor() {}
  ngOnInit(): void {
    if (this.packageListWidgetOptions.length) {
      this.packageGroupList = this.packageListWidgetOptions;
    }
    if (this.totalpackageCount) {
      this.calculateRemainingCount();
    }
  }

  calculateRemainingCount(): void {
    if (Number(this.totalpackageCount) > 5) {
      this.remainingCount = Number(this.totalpackageCount) - 5;
    }
  }
}
