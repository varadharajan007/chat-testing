import { Component, OnInit, NgZone, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked, OnDestroy, AfterContentChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManhClient } from './client-sdk/manh-client';
import { ChatEventConstants } from './models/chatevent-constants';
import { ChatConstants } from './models/chat-constants';
import { Subscription } from 'rxjs';
import { WidgetsMock } from './models/widgets.mock';
import { DomSanitizer } from '@angular/platform-browser';
import { SelfServiceConstants } from '../core/util/selfservice-constants';
import { RequestParam } from '../core/services/request-param.model';
import { TranslatePipe } from '../core/pipes/translate/translate.pipe';
import { ChatService } from './services/chat.service';
import * as _ from 'lodash';

@Component({
  selector: 'dss-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss', './chatutil.scss'],
  providers: [TranslatePipe]
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked, AfterContentChecked {
  loading = true;
  messages: any = [];
  conversation: any;
  connected: any;
  connecting: any;
  initialLoading = true;
  connectionStatus: any;
  disableReplyActions = true;
  replyText = '';
  formData = new FormData();
  errorMessage = '';
  registeredCustomerId: any;
  agentId: any;
  agentName: any;
  token: any;
  mode: any;
  conversationId: any;
  isTyping = false;
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  disableScrollDown = false;
  connectToExternalChat = false;
  queryParamSubscription: Subscription = new Subscription();
  displayWelcomeMessage = true;
  public locale: any;
  public requestParam: RequestParam = new RequestParam();
  staticData: any;
  chatStarted: any;
  chipsWidget: any = [];
  displayChips = false;
  sendBtnDisable = false;
  chatItemClosed = false;
  chatEnded: any;
  chatBotConfigEnabled = false;
  orgId: any;
  public config: any;
  isChatConfigLoaded = false;
  sophiaChat: any;
  minimize = false;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    public sanitizer: DomSanitizer,
    private translate: TranslatePipe,
    private chatservice: ChatService
  ) {
    this.queryParamSubscription = this.route.queryParams.subscribe(params => {
      this.token = params[ChatConstants.TOKEN];
      this.mode = params[ChatConstants.MODE];
      this.conversationId = params[ChatConstants.CONVERSATION_ID];
      this.registeredCustomerId = params[ChatConstants.REGISTERED_CUSTOMER_ID];
      this.locale = params[SelfServiceConstants.LOCALE];
      this.orgId = params[ChatConstants.ORG_ID];

      // TODO to remove below code once we move out of iframe within selfserve app -
      // to handle selfserve pages without greetings to display in conversations
      // need to set displayWelcomeMessage based on isFromExternal flag
      if (params?.isFromExternal) {
        this.displayWelcomeMessage = false;
      }
      this.initializeChatWindow();
    });

  }

  ngOnInit(): void {
    if (this.route?.snapshot?.data?.translate?.data) {
      this.staticData = this.route?.snapshot?.data?.translate?.data;
      this.route.snapshot.data.translate = this.staticData?.ResourceBundles;
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngAfterContentChecked(): void {
    this.scrollToBottom();
  }

  initializeChatWindow(): void {
    if (this.mode === ChatConstants.SIMPLE_MODE) {
      this.displayWelcomeMessage = false;
    }

    this.isChatEnabled();
  }


  isChatEnabled(): void {
    if (this.orgId) {
      this.requestParam = { orgId: this.orgId, token: this.token, conversationId: this.conversationId };
    }
    this.isChatConfigLoaded = false;
    this.chatservice.getChatConfig(this.requestParam).subscribe(response => {
      this.chatBotConfigEnabled = response?.data?.EnableAssistant;
      if (this.chatBotConfigEnabled) {
        this.loadConversations();
      } else {
        this.errorMessage = this.translate.transform('chatbotComingSoon_TC');
      }
      this.isChatConfigLoaded = true;
    }, (error) => {

      this.chatBotConfigEnabled = false;
      this.errorMessage = this.translate.transform('unableToProcessRequest_TC');
      this.isChatConfigLoaded = true;
    });
  }

  loadConversations(): void {
    if (this.token && this.conversationId) {
      this.fetchConversations();
    } else {
      this.router.navigate(['app/404']);
    }
  }

  fetchConversations(): void {
    this.chatStarted = new Date();
    ManhClient.initialize({
      accessToken: this.token, conversationId: this.conversationId, registeredCustomerId: this.registeredCustomerId,
      onConversationLoaded: (conversation: any, error: any) => {
        this.ngZone.run(() => {
          if (error) {
            this.errorMessage = this.translate.transform(error);
          } else {
            this.conversation = conversation;
            this.loading = false;
            this.disableReplyActions = false;
            this.disableScrollDown = false;
            if (this.conversation) {
              const titleString = this.translate.transform('sophiaChat_TC');
              this.sophiaChat = titleString.charAt(0);
              this.displayWelcomeText();
              this.fetchMessages();
              this.conversation.on(ChatEventConstants.MESSAGE_ADDED, () => {
                this.scrollToBottom();
                this.fetchMessages();
              });
              this.conversation.on(ChatEventConstants.AGENT_ADDED, () => {
                this.fetchMessages();
              });
              this.conversation.on(ChatEventConstants.TYPING_STARTED, () => {
                this.updateTypingIndicator(true);
              });
              this.conversation.on(ChatEventConstants.TYPING_ENDED, () => {
                this.updateTypingIndicator(false);
              });
            }
          }
        });
      },
      onConnected: (state: any) => {
        this.initialLoading = false;
        if (state === 'connected') {
          this.connectionStatus = this.translate.transform('connected_TC');
        } else if (state === 'connecting') {
          this.connectionStatus = this.translate.transform('connecting_TC');
        } else if (state === 'disconnecting') {
          this.connectionStatus = this.translate.transform('disconnecting_TC');
        } else if (state === 'disconnected') {
          this.connectionStatus = this.translate.transform('disconnected_TC');
        } else if (state === 'denied') {
          this.connectionStatus = this.translate.transform('denied_TC');
        }
        this.connected = state === 'connected';
        this.connecting = (state === 'connecting' || state === 'connected');
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  fetchMessages(): void {
    this.messages = this.conversation.getMessages();
    this.changeDetectorRef.detectChanges();
  }
  displayWelcomeText(): void {
    if (this.displayWelcomeMessage) {
      this.conversation.sendMessage(this.translate.transform('__startSession__Hi'));
      this.displayWelcomeMessage = false;
    }
  }

  displayMainMenuChips(): void {
    this.chatservice.getChatFeatureConfig(this.requestParam, true).subscribe(response => {
      const featureConfigList = response?.data || [];
      const featureIdList: any = [];
      if (featureConfigList) {
        featureConfigList.forEach((featureConfig: any) => {
          if (featureConfig?.FeatureId) {
            featureIdList.push(featureConfig?.FeatureId);
          }
        });
      }
      const chipObject = {
        body: '__widget__',
        attributes: {
          type: 'widget',
          widget: [
            {
              widgetType: 'chip',
              options: JSON.stringify(featureIdList),
            },
          ],
        },
      };
      this.conversation._addMessage(chipObject);
    });
  }

  updateTypingIndicator(response: any): void {
    this.isTyping = response;
    this.changeDetectorRef.detectChanges();
  }

  onSend(): void {
    this.disableScrollDown = false;
    if (this.conversation) {
      this.conversation.sendMessage(this.replyText);
    }
    this.replyText = '';
    this.displayChips = false;
  }

  onChipClick(id: any): void {
    if (this.conversation) {
      const translateMessage = this.translate.transform(id);
      this.conversation.sendMessage(translateMessage);
    }
    this.displayChips = false;
  }

  onFileInput($event: any): void {
    if ($event && $event.target && $event.target.files && $event.target.files.length > 0) {
      this.formData.append('files', $event.target.files[0]);
      this.conversation.sendMessage(this.formData);
      this.formData = new FormData();
    }
  }

  scrollToBottom(): void {
    if (this.disableScrollDown) {
      return;
    }
    try {
      if (this.myScrollContainer) {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
    }
  }

  onScroll(): void {
    const element = this.myScrollContainer.nativeElement;
    const atBottom = (Math.ceil(element.scrollTop)) >= (element.scrollHeight - element.offsetHeight);
    if (atBottom) {
      this.disableScrollDown = false;
    } else {
      this.disableScrollDown = true;
    }
  }
  // connectToAgent(): void {
  //   parent.postMessage({ connectToExternalChat : true }, '*');
  // }

  onKeyDown(e: any): void {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.onSend();
    }
    else {
      if (this.conversation) {
        this.conversation.typing();
      }
    }
  }

  getLatestTime(): Date {
    return new Date();
  }

  getMessageBubbleClassName(index: any, senderType: any): string {
    if (this.showMessageTime(index)) {
      return (senderType !== 'customer') ? 'bubble' : 'bubble';
    }
    return '';
  }
  showMessageTime(index: any): boolean {
    if (this.messages && this.messages.length > index) {
      if (this.messages[index] && this.messages[index + 1] && (this.messages[index].senderType === this.messages[index + 1].senderType)) {
        if (this.messages[index + 1]?.attributes?.widget?.length
          && this.messages[index + 1]?.attributes?.widget[0]?.widgetType === 'chip') {
          return true;
        }
        return this.compareTimestamp(this.messages[index].dateUpdated, this.messages[index + 1].dateUpdated);
      }
    }
    return true;
  }

  compareTimestamp(time1: any, time2: any): boolean {
    if (time1 && time2) {
      const t1 = new Date(time1).toLocaleString().slice(0, 17);
      const t2 = new Date(time2).toLocaleString().slice(0, 17);
      return t1 !== t2;
    }
    return true;
  }

  showChipWidget(): any {
    if (this.messages.length >= 1 && this.messages[0]?.attributes?.widget?.length) {
      const widgetType = this.messages[0]?.attributes?.widget[0]?.widgetType;
      if (widgetType === 'chip') {
        this.chipsWidget = this.messages[0]?.attributes?.widget[0]?.options;
        return true;
      }
    }
    return false;
  }

  setChipWidgetProps(chipOptions: string): boolean {
    if (!chipOptions || this.displayChips) {
      return false;
    }
    const length = this.messages?.length;
    const chipWidget = this.messages[length - 1]?.attributes?.widget;
    const jsonString = chipWidget?.length && chipWidget[0]?.options;
    if (jsonString) {
      const chiplist = this.getDialogFlowJson(jsonString);
      if (chiplist && chiplist[0]?.FeatureId && !_.isEqual(chiplist, this.chipsWidget)) {
        this.displayChips = true;
        this.chipsWidget = [];
        this.chipsWidget = chiplist;
      }
    }
    return false;
  }

  getDialogFlowJson(jsonString: string): any {
    // Dialog flow is returning array of object without [], to support we have below json String conversion for getJSONObj arguments
    if (jsonString) {
      return (jsonString[0] === '[') ? this.getJSONObj(jsonString) :
        this.getJSONObj('[' + jsonString.replace(/}{(?=([^"]*"[^"]*")*[^"]*$)/g, '},{') + ']');
    }
  }
  getJSONObj(jsonString: string): any {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return false;
    }
  }
  chatWindowMinimize(): any {
    ManhClient.minimize(this.minimize);
  }
  onEndSession(): any {
    this.disableReplyActions = true;
    this.sendBtnDisable = true;
    this.chatItemClosed = true;
    this.displayChips = false;
    const currentDate = new Date();
    this.chatEnded = this.chatEnded ? this.chatEnded : currentDate;
  }
  ngOnDestroy(): void {
    if (this.queryParamSubscription) {
      this.queryParamSubscription.unsubscribe();
    }
  }
}

