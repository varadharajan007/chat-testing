import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { PackageDetailsComponent } from './package-details/package-details.component';
import { MatCardModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { ImageStripsComponent } from './image-strips/image-strips.component';
import { PackageListComponent } from './package-list/package-list.component';
import { SharedModule } from '../shared.module';


@NgModule({
  declarations: [HeaderComponent, PackageDetailsComponent, ImageStripsComponent, PackageListComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatCardModule,
    SharedModule
  ],
  exports: [
    HeaderComponent,
    PackageDetailsComponent,
    PackageListComponent,
    ImageStripsComponent,
    SharedModule
  ]
})
export class WidgetsModule { }
