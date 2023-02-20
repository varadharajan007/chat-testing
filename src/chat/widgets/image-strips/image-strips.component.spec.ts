import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ImageStripsComponent } from './image-strips.component';

describe('ImageStripsComponent', () => {
  let component: ImageStripsComponent;
  let fixture: ComponentFixture<ImageStripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageStripsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageStripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display images with Quantity badge when items with more than one Quantity is available in widget options', () => {
    component.imageStripWidgetOptions = {
      OrderLine: [
        {
          SmallImageURI:
            'http://res.cloudinary.com/com-manh-cp/image/upload/13153_resortwhitepackyourtrunk_a1.jpg',
          Quantity: 5,
          ItemShortDescription: 'CAPTAIN PRINTED POPOVER',
        },
        {
          SmallImageURI:
            'http://res.cloudinary.com/com-manh-cp/image/upload/20032_flamingopinkdontgiveacluck_a1.jpg',
          ItemShortDescription: 'TYRA STRAPLESS PRINTED TUBE TOP',
          Quantity: 1,
        },
      ],
      TotalCount: 2,
    };
    component.ngOnInit();
    fixture.detectChanges();
    const ImageItemHTMLElemList = fixture.debugElement.queryAll(By.css('[data-component-id=ImageItem]'));
    expect(ImageItemHTMLElemList.length).toBe(2);
    const imageElem1 = ImageItemHTMLElemList[0].query(By.css('[data-component-id=Image]')).nativeElement;
    const imageElem2 = ImageItemHTMLElemList[1].query(By.css('[data-component-id=Image]')).nativeElement;
    expect(imageElem1).toBeTruthy();
    expect(imageElem1.attributes.src.value).toBe
    ('http://res.cloudinary.com/com-manh-cp/image/upload/13153_resortwhitepackyourtrunk_a1.jpg');
    expect(imageElem2).toBeTruthy();
    expect(imageElem2.attributes.src.value).toBe
    ('http://res.cloudinary.com/com-manh-cp/image/upload/20032_flamingopinkdontgiveacluck_a1.jpg');
    const qtyElem1 = ImageItemHTMLElemList[0].query(By.css('[data-component-id=Quantity]')).nativeElement;
    const qtyElem2 = ImageItemHTMLElemList[1].query(By.css('[data-component-id=Quantity]'));
    expect(qtyElem1.innerText).toBe('5');
    expect(qtyElem2).toBeFalsy();
    const excessQuantityBadgeElem = fixture.debugElement.query(By.css('[data-component-id=ExcessQuantityBadge]'));
    expect(excessQuantityBadgeElem).toBeFalsy();
  });

  it('should display images with excess Quantity badge when there are more than 4 items is available in widget options', () => {
    component.imageStripWidgetOptions = {
      OrderLine: [
        {
          SmallImageURI:
            'http://res.cloudinary.com/com-manh-cp/image/upload/13153_resortwhitepackyourtrunk_a1.jpg',
          Quantity: 5,
          ItemShortDescription: 'CAPTAIN PRINTED POPOVER',
        },
        {
          SmallImageURI:
            'http://res.cloudinary.com/com-manh-cp/image/upload/20032_flamingopinkdontgiveacluck_a1.jpg',
          ItemShortDescription: 'TYRA STRAPLESS PRINTED TUBE TOP',
          Quantity: 5,
        },
        {
          SmallImageURI:
            'http://res.cloudinary.com/com-manh-cp/image/upload/13153_resortwhitepackyourtrunk_a1.jpg',
          Quantity: 5,
          ItemShortDescription: 'CAPTAIN PRINTED POPOVER',
        },
        {
          SmallImageURI:
            'http://res.cloudinary.com/com-manh-cp/image/upload/20032_flamingopinkdontgiveacluck_a1.jpg',
          ItemShortDescription: 'TYRA STRAPLESS PRINTED TUBE TOP',
          Quantity: 5,
        }
      ],
      TotalCount: 4,
    };
    component.ngOnInit();
    fixture.detectChanges();
    const ImageItemHTMLElemList = fixture.debugElement.queryAll(By.css('[data-component-id=ImageItem]'));
    expect(ImageItemHTMLElemList.length).toBe(3);
    const excessQuantityBadgeElem = fixture.debugElement.query(By.css('[data-component-id=ExcessQuantityBadge]')).nativeElement;
    expect(excessQuantityBadgeElem).toBeTruthy();
    expect(excessQuantityBadgeElem.innerText).toBe('+1');
  });

  it('should not display images with Quantity badge when items are not available in widget options', () => {
    component.imageStripWidgetOptions = [];
    component.ngOnInit();
    fixture.detectChanges();
    const ImageItemHTMLElemList = fixture.debugElement.queryAll(By.css('[data-component-id=ImageItem]'));
    expect(ImageItemHTMLElemList.length).toBe(0);
    const imageElem = fixture.debugElement.query(By.css('[data-component-id=Image]'));
    const qtyElem = fixture.debugElement.query(By.css('[data-component-id=Quantity]'));
    const excessQuantityBadgeElem = fixture.debugElement.query(By.css('[data-component-id=ExcessQuantityBadge]'));
    expect(imageElem).toBeFalsy();
    expect(qtyElem).toBeFalsy();
    expect(excessQuantityBadgeElem).toBeFalsy();
  });
});
