// import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
// import { ChatComponent } from './chat.component';
// import { RouterTestingModule } from '@angular/router/testing';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { observable, of } from 'rxjs';
// import * as EventEmitter from 'events';
// import { ChatService } from './services/chat.service';

// const activatedRouteMock = {
//   queryParams: of({}),
// };

// class ConversationMock extends EventEmitter {
//   public messages: any = [];
//   constructor() {
//     super();
//   }
//   sendMessage(message: any): any {
//     this.messages.push(message);
//   }
//   getMessages(): any {
//     return this.messages;
//   }

// }

// describe('ChatComponent', () => {
//   let component: ChatComponent;
//   let fixture: ComponentFixture<ChatComponent>;
//   let chatservice: ChatService;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [ChatComponent, NotFoundComponent],
//       imports: [
//         SharedTestModule,
//         RouterTestingModule.withRoutes([
//           { path: 'app/404', component: NotFoundComponent },
//           { path: 'app/chat', component: ChatComponent },
//         ]),
//       ],
//       providers: [
//         { provide: ActivatedRoute, useValue: activatedRouteMock },
//         { provide: ChatService, useValue: TestUtil.getChatServiceStub() }],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ChatComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should call loadconversation if virtual config EnableAssistant is true', () => {
//     chatservice = TestBed.inject(ChatService);
//     const getChatConfigSpy = spyOn(chatservice, 'getChatConfig').and.callThrough();
//     const chatEnabledSpy = spyOn(component, 'isChatEnabled');
//     const loadConversationsSpy = spyOn(component, 'loadConversations');
//     component.token = 'RANDOM-TOKEN';
//     component.conversationId = 'RANDOM-CONVERSATION-ID';
//     component.chatBotConfigEnabled = true;
//     chatservice.getChatConfig({});
//     component.initializeChatWindow();
//     component.loadConversations();
//     fixture.detectChanges();

//     expect(chatEnabledSpy).toHaveBeenCalled();
//     expect(getChatConfigSpy).toHaveBeenCalled();
//     expect(component.chatBotConfigEnabled).toBeTrue();
//     expect(loadConversationsSpy).toHaveBeenCalled();
//   });

//   it('should not call loadconversation if virtual config EnableAssistant is false', () => {
//     chatservice = TestBed.inject(ChatService);
//     const response = ChatBotMock.ChatConfig;
//     response.data.EnableAssistant = false;
//     const getChatConfigSpy = spyOn(chatservice, 'getChatConfig').and.returnValue(of(response));
//     const loadConversationsSpy = spyOn(component, 'loadConversations');
//     component.token = 'RANDOM-TOKEN';
//     component.conversationId = 'RANDOM-CONVERSATION-ID';
//     component.chatBotConfigEnabled = true;
//     chatservice.getChatConfig({});
//     component.initializeChatWindow();
//     fixture.detectChanges();

//     expect(getChatConfigSpy).toHaveBeenCalled();
//     expect(component.chatBotConfigEnabled).toBeFalse();
//     expect(loadConversationsSpy).not.toHaveBeenCalled();
//     expect(component.errorMessage).toBe('chatbotComingSoon_TC');
//   });

//   it('should call fetchConversations when token and conversationId is available', () => {
//     const fetchConversationsSpy = spyOn(component, 'fetchConversations');
//     component.token = 'RANDOM-TOKEN';
//     component.conversationId = 'RANDOM-CONVERSATION-ID';

//     component.loadConversations();
//     fixture.detectChanges();

//     expect(component.token).toBeDefined();
//     expect(component.conversationId).toBeDefined();
//     expect(fetchConversationsSpy).toHaveBeenCalled();
//   });

//   it('should not call fetchConversations when token and conversationId not available', () => {
//     const fetchConversationsSpy = spyOn(component, 'fetchConversations');
//     component.token = null;
//     component.conversationId = null;
//     const router = TestBed.inject(Router);
//     const routerSpy = spyOn(router, 'navigate');

//     component.loadConversations();
//     fixture.detectChanges();

//     expect(component.token).toBeNull();
//     expect(component.conversationId).toBeNull();
//     expect(fetchConversationsSpy).not.toHaveBeenCalled();
//     expect(routerSpy).toHaveBeenCalledWith(['app/404']);
//   });

//   it('should show error message, denied status when token, conversationId is not available', () => {

//     const ManhClientspy = spyOn(ManhClient, 'initialize').and.callFake(
//       (payload: any) => {
//         if (payload?.accessToken) {
//           payload.onConversationLoaded({
//             on: () => { }
//           }, null);
//           payload.onConnected('connected');
//           payload = payload;
//         } else {
//           payload.onConversationLoaded(null, 'errorWhileFetching_TC');
//           payload.onConnected('denied');
//         }
//       }
//     );
//     component.token = null;
//     component.conversationId = null;
//     component.registeredCustomerId = null;
//     component.fetchConversations();
//     fixture.detectChanges();

//     expect(ManhClientspy).toHaveBeenCalled();
//     expect(component.errorMessage).toBe('errorWhileFetching_TC');
//     expect(component.connectionStatus).toBe('denied_TC');
//     expect(component.connected).toBeFalse();
//     expect(component.connecting).toBeFalse();
//   });

//   it('should show welcome message, connected status when token, conversationId is available', () => {
//     const conversationPayload = new ConversationMock();
//     const ManhClientspy = spyOn(ManhClient, 'initialize').and.callFake(
//       (payload: any) => {
//         if (payload?.accessToken) {
//           payload.onConversationLoaded(conversationPayload, null);
//           payload.onConnected('connected');
//         }
//       }
//     );
//     const fetchMessagesSpy = spyOn(component, 'fetchMessages');
//     component.token = 'RANDOM-TOKEN';
//     component.conversationId = 'RANDOM-CONVERSATION-ID';
//     component.registeredCustomerId = 'RANDOM-ID';
//     component.fetchConversations();
//     fixture.detectChanges();

//     expect(ManhClientspy).toHaveBeenCalled();
//     expect(component.displayWelcomeMessage).toBeFalse();
//     expect(fetchMessagesSpy).toHaveBeenCalled();
//     expect(component.connectionStatus).toBe('connected_TC');
//     expect(component.connected).toBeTrue();
//     expect(component.connecting).toBeTrue();

//   });

//   it('should call conversation chat event message added', () => {
//     const conversationPayload = new ConversationMock();
//     const ManhClientspy = spyOn(ManhClient, 'initialize').and.callFake(
//       (payload: any) => {
//         if (payload?.accessToken) {
//           payload.onConversationLoaded(conversationPayload, null);
//           payload.onConnected('connected');
//         }
//       }
//     );

//     const fetchMessagesSpy = spyOn(component, 'fetchMessages');
//     const scrollToBottomSpy = spyOn(component, 'scrollToBottom');
//     component.token = 'RANDOM-TOKEN';
//     component.conversationId = 'RANDOM-CONVERSATION-ID';
//     component.registeredCustomerId = 'RANDOM-ID';

//     component.fetchConversations();
//     fixture.detectChanges();
//     expect(fetchMessagesSpy).toHaveBeenCalled();

//     conversationPayload.emit('manh:messageadded', component);
//     fixture.detectChanges();
//     expect(fetchMessagesSpy).toHaveBeenCalled();

//     expect(scrollToBottomSpy).toHaveBeenCalled();
//     expect(component.disableScrollDown).toBe(false);

//   });

//   it('should call conversation chat event agent added', () => {
//     const conversationPayload = new ConversationMock();
//     const ManhClientspy = spyOn(ManhClient, 'initialize').and.callFake(
//       (payload: any) => {
//         if (payload?.accessToken) {
//           payload.onConversationLoaded(conversationPayload, null);
//           payload.onConnected('connected');
//         }
//       }
//     );

//     const fetchMessagesSpy = spyOn(component, 'fetchMessages');

//     component.token = 'RANDOM-TOKEN';
//     component.conversationId = 'RANDOM-CONVERSATION-ID';
//     component.registeredCustomerId = 'RANDOM-ID';

//     component.fetchConversations();
//     fixture.detectChanges();
//     expect(fetchMessagesSpy).toHaveBeenCalled();

//     conversationPayload.emit('manh:agentadded');
//     fixture.detectChanges();
//     expect(fetchMessagesSpy).toHaveBeenCalled();

//   });

//   it('should call conversation chat event typing started', () => {
//     const conversationPayload = new ConversationMock();
//     const ManhClientspy = spyOn(ManhClient, 'initialize').and.callFake(
//       (payload: any) => {
//         if (payload?.accessToken) {
//           payload.onConversationLoaded(conversationPayload, null);
//           payload.onConnected('connected');
//         }
//       }
//     );
//     component.token = 'RANDOM-TOKEN';
//     component.conversationId = 'RANDOM-CONVERSATION-ID';
//     component.registeredCustomerId = 'RANDOM-ID';

//     component.fetchConversations();
//     fixture.detectChanges();

//     conversationPayload.emit('manh:typingstarted');
//     fixture.detectChanges();

//     expect(component.isTyping).toBeTrue();
//   });

//   it('should call conversation chat event typing ended', () => {
//     const conversationPayload = new ConversationMock();
//     const ManhClientspy = spyOn(ManhClient, 'initialize').and.callFake(
//       (payload: any) => {
//         if (payload?.accessToken) {
//           payload.onConversationLoaded(conversationPayload, null);
//           payload.onConnected('connected');
//         }
//       }
//     );

//     component.token = 'RANDOM-TOKEN';
//     component.conversationId = 'RANDOM-CONVERSATION-ID';
//     component.registeredCustomerId = 'RANDOM-ID';
//     component.fetchConversations();
//     fixture.detectChanges();
//     conversationPayload.emit('manh:typingended');
//     fixture.detectChanges();
//     expect(component.isTyping).toBeFalse();
//   });
// });
