import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatService } from '../services/chat.service';
import { ChatScreenComponent } from './chat-screen.component';

describe('ChatScreenComponent', () => {
  let component: ChatScreenComponent;
  let fixture: ComponentFixture<ChatScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatScreenComponent ],
      providers: [ChatService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
