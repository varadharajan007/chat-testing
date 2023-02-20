// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { TranslatePipe } from 'src/app/core/pipes/translate/translate.pipe';
// import { SharedTestModule } from 'src/app/core/test/shared-test.module.spec';
// import { PackageDetailsComponent } from './package-details.component';

// describe('PackageDetailsComponent', () => {
//   let component: PackageDetailsComponent;
//   let fixture: ComponentFixture<PackageDetailsComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [ PackageDetailsComponent ],
//       providers: [TranslatePipe],
//       imports: [SharedTestModule]
//     })
//     .compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(PackageDetailsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should display fulfilled order package details with image, ETA when statusGroup is Shipped and ETA is available', () => {
//     component.packageDetailsWidgetOptions = {
//       Status: 'Shipped',
//       ETA: '2010-09-12T11:57:00',
//       ImageStripe: {
//         OrderLine: [
//           {
//             Quantity: 1,
//             ItemShortDescription: 'Coolife Luggage Suitcase Spinner Softshell',
//             SmallImageURI:
//               'https://res.cloudinary.com/com-manh-cp/image/upload/v1529643542/CS1001212_1.jpg',
//           },
//         ],
//         TotalCount: 1
//       }
//     };
//     fixture.detectChanges();
//     const packageInfoHTMLElem = fixture.debugElement.query(By.css('[data-component-id=PackageInfo]')).nativeElement;
//     const ETAElem = fixture.debugElement.query(By.css('[data-component-id=ETA]')).nativeElement;
//     const shippingInfotElem = fixture.debugElement.query(By.css('[data-component-id=ShippingInfo]'));
//     const itemsListElem = fixture.debugElement.query(By.css('[data-component-id=ItemsList]'));
//     expect(packageInfoHTMLElem).toBeTruthy();
//     expect(ETAElem.innerText).toBe('arrivingon_TC September 12');
//     expect(itemsListElem).toBeTruthy();
//     expect(shippingInfotElem).toBeFalsy();
//   });

//   it(`should display delivered order package details with image, ETA error text
//   when statusGroup is Delivered and ETA is not available`, () => {
//     component.packageDetailsWidgetOptions = {
//       Status: 'Delivered',
//       ETA: null,
//       ImageStripe: {
//         OrderLine: [
//           {
//             Quantity: 1,
//             ItemShortDescription: 'Coolife Luggage Suitcase Spinner Softshell',
//             SmallImageURI:
//               'https://res.cloudinary.com/com-manh-cp/image/upload/v1529643542/CS1001212_1.jpg',
//           },
//         ],
//         TotalCount: 1
//       }
//     };
//     fixture.detectChanges();
//     const packageInfoHTMLElem = fixture.debugElement.query(By.css('[data-component-id=PackageInfo]')).nativeElement;
//     const ETAElem = fixture.debugElement.query(By.css('[data-component-id=ETA]'));
//     // const errorETAElem = fixture.debugElement.query(By.css('[data-component-id=ErrorETAText]')).nativeElement;
//     const shippingInfotElem = fixture.debugElement.query(By.css('[data-component-id=ShippingInfo]'));
//     const itemsListElem = fixture.debugElement.query(By.css('[data-component-id=ItemsList]'));
//     expect(packageInfoHTMLElem).toBeTruthy();
//     // expect(ETAElem).toBeFalsy();
//     // expect(ETAElem).toBeTruthy();
//     // expect(ETAElem.innerText).toBe('etaNotAvailable_SC');
//     expect(itemsListElem).toBeTruthy();
//     expect(shippingInfotElem).toBeFalsy();
//   });

//   it('should display allocated/released order with image when statusGroup is PreparingToShip', () => {
//     component.packageDetailsWidgetOptions = {
//       Status: 'PreparingToShip',
//       ETA: '2010-09-12T11:57:00',
//       ImageStripe: {
//         OrderLine: [
//           {
//             Quantity: 1,
//             ItemShortDescription: 'Coolife Luggage Suitcase Spinner Softshell',
//             SmallImageURI:
//               'https://res.cloudinary.com/com-manh-cp/image/upload/v1529643542/CS1001212_1.jpg',
//           },
//         ],
//         TotalCount: 1
//       }
//     };
//     fixture.detectChanges();
//     const packageInfoHTMLElem = fixture.debugElement.query(By.css('[data-component-id=PackageInfo]'));
//     const ETAElem = fixture.debugElement.query(By.css('[data-component-id=ETA]'));
//     const shippingInfotElem = fixture.debugElement.query(By.css('[data-component-id=ShippingInfo]')).nativeElement;
//     const itemsListElem = fixture.debugElement.query(By.css('[data-component-id=ItemsList]'));
//     expect(ETAElem).toBeFalsy();
//     expect(itemsListElem).toBeTruthy();
//     expect(packageInfoHTMLElem).toBeFalsy();
//     expect(shippingInfotElem).toBeTruthy();
//     expect(shippingInfotElem.innerText).toBe('preparingToShip_SC');
//   });

//   it('should display cancelled/BackOrdered/Returned message when statusGroup is Cancelled/BackOrdered/Returned', () => {
//     component.packageDetailsWidgetOptions = {
//       Status: 'Cancelled'
//     };
//     fixture.detectChanges();
//     const packageInfoHTMLElem = fixture.debugElement.query(By.css('[data-component-id=PackageInfo]'));
//     const shippingInfotElem = fixture.debugElement.query(By.css('[data-component-id=ShippingInfo]')).nativeElement;
//     expect(packageInfoHTMLElem).toBeFalsy();
//     expect(shippingInfotElem.innerText).toBe('cancelled_TC');


//     component.packageDetailsWidgetOptions = {
//       Status: 'BackOrdered'
//     };
//     fixture.detectChanges();
//     expect(packageInfoHTMLElem).toBeFalsy();
//     expect(shippingInfotElem.innerText).toBe('processing_TC');


//     component.packageDetailsWidgetOptions = {
//       Status: 'Returned'
//     };
//     fixture.detectChanges();
//     expect(packageInfoHTMLElem).toBeFalsy();
//     expect(shippingInfotElem.innerText).toBe('returned_TC');
//   });

//   it('should not display image, eta when OrderLineItemDetailsList, ETA are not available', () => {
//     component.packageDetailsWidgetOptions = {
//       Status: 'Cancelled'
//     };
//     fixture.detectChanges();
//     const ETAElem = fixture.debugElement.query(By.css('[data-component-id=ETA]'));
//     const itemsListElem = fixture.debugElement.query(By.css('[data-component-id=ItemsList]'));
//     expect(ETAElem).toBeFalsy();
//     expect(itemsListElem).toBeFalsy();
//   });
// });
