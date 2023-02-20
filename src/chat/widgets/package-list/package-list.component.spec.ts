// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { ActivatedRoute } from '@angular/router';
// import { of } from 'rxjs';
// import { TranslatePipe } from 'src/app/core/pipes/translate/translate.pipe';
// import { SharedTestModule } from 'src/app/core/test/shared-test.module.spec';
// import { PackageListComponent } from './package-list.component';

// const activatedRouteMock = {
//   queryParams: of({}),
// };

// describe('PackageListComponent', () => {
//   let component: PackageListComponent;
//   let fixture: ComponentFixture<PackageListComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [ PackageListComponent ],
//       providers: [
//         TranslatePipe,
//         { provide: ActivatedRoute, useValue: activatedRouteMock },
//       ],
//       imports: [SharedTestModule]
//     })
//     .compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(PackageListComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should display remaining package count, if count is more than 5', () => {
//     component.totalpackageCount = 7;
//     component.packageGroupList = [{}, {}, {}, {}, {}, {}, {}];
//     component.calculateRemainingCount();
//     fixture.detectChanges();
//     const excessPackageElem = fixture.debugElement.query(By.css('[data-component-id=ExcessPackageMessage]')).nativeElement;
//     expect(component.totalpackageCount).toBe(7);
//     expect(component.remainingCount).toBe(2);
//     expect(excessPackageElem).toBeTruthy();
//   });

//   it('should not display remaining package count,if count is less than 5', () => {
//     component.totalpackageCount = 4;
//     component.calculateRemainingCount();
//     fixture.detectChanges();
//     const excessPackageElem = fixture.debugElement.query(By.css('[data-component-id=ExcessPackageMessage]'));
//     expect(component.remainingCount).toBe(0);
//     expect(excessPackageElem).toBeFalsy();
//   });

// });
