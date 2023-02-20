import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: []
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display orderId and icon button when widget options has orderid and tracking url', () => {
    component.headerWidgetOptions = {
      orderId: 'CC10001',
      button: {
        type: 'icon',
        url: 'https//tracking.url.com/',
        target: '_blank'
      },
      widgetType: 'order-header'
    };
    fixture.detectChanges();
    const orderIdHTMLElem = fixture.debugElement.query(By.css('[data-component-id=OrderId]')).nativeElement;
    const buttonElem = fixture.debugElement.query(By.css('[data-component-id=Button]')).nativeElement;
    const buttonTextElem = fixture.debugElement.query(By.css('[data-component-id=ButtonText]'));
    const buttonIconElem = fixture.debugElement.query(By.css('[data-component-id=IconButton]'));
    expect(orderIdHTMLElem.innerText).toBe('CC10001');
    expect(buttonElem).toBeTruthy();
    expect(buttonElem.attributes.href.value).toBe('https//tracking.url.com/');
    expect(buttonElem.attributes.target.value).toBe('_blank');
    expect(buttonIconElem).toBeTruthy();
    expect(buttonTextElem).toBeFalsy();
  });

  it('should not display orderId and icon button when widget options doesnt have orderid and tracking url', () => {
    component.headerWidgetOptions = {
      button: {
        text: 'ButtonText'
      },
      widgetType: 'order-header'
    };
    fixture.detectChanges();
    const orderIdHTMLElem = fixture.debugElement.query(By.css('[data-component-id=OrderId]'));
    const buttonElem = fixture.debugElement.query(By.css('[data-component-id=Button]')).nativeElement;
    const buttonTextElem = fixture.debugElement.query(By.css('[data-component-id=ButtonText]'));
    const buttonIconElem = fixture.debugElement.query(By.css('[data-component-id=IconButton]'));
    expect(orderIdHTMLElem).toBeTruthy();
    expect(buttonElem).toBeTruthy();
    expect(buttonElem.attributes.href.value).toBe('');
    expect(buttonIconElem).toBeFalsy();
    expect(buttonTextElem).toBeTruthy();
    expect(buttonTextElem.nativeElement.innerText).toBe('ButtonText');
  });

  it(`should display icon button href having tracking url with conversationid and token
  when conversationid and token are available`, () => {
    component.headerWidgetOptions = {
      orderId: 'CC10001',
      button: {
        type: 'icon',
        url: 'https//tracking.url.com?trackingNumber=123&carierCode=UPS',
        target: '_blank'
      },
      widgetType: 'order-header'
    };
    component.conversationid = 'RANDOM_ID';
    component.token = 'RANDOM_TOKEN';
    component.orgId = 'DUMMY_ORG';
    fixture.detectChanges();
    const buttonElem = fixture.debugElement.query(By.css('[data-component-id=Button]')).nativeElement;
    expect(buttonElem.attributes.href.value).toBe('https//tracking.url.com?trackingNumber=123&carierCode=UPS&conversationId=RANDOM_ID&chatToken=RANDOM_TOKEN&orgId=DUMMY_ORG');
  });
});
