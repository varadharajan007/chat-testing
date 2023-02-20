import { Component, Input, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { CustomerRequest } from '../../models/customer-request.model';
import { ChatService } from '../../services/chat.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatConstants } from '../../models/chat-constants';

@Component({
  selector: 'dss-chat-floatbutton',
  templateUrl: './chat-floatbutton.component.html',
  styleUrls: ['./chat-floatbutton.component.scss']
})
export class ChatFloatbuttonComponent implements OnInit {
  showPopup = false;
  isReturn = false;
  token: any;
  conversationId: any;
  isLoading = false;
  orgId: any;
  requestParam: HttpParams | any = {};
  requestBody: CustomerRequest = {};
  url: any;
  sanitizedUrl: any;
  public staticData: any;
  @Input() public externalConversationIdFrm: any;
  @Input() public externalTokenIdFrm: any;
  @Input() public externalShowPopupFrm: any;
  isMinimisedChatWindow = false;

  constructor(private chatservice: ChatService, private sanitizer: DomSanitizer, private route: ActivatedRoute, private router: Router) {
    const currentUrlPath = this.router.url.split('?')[0];
    if (currentUrlPath.includes('return')) {
      this.isReturn = true;
    }
    this.route.queryParams.subscribe(params => {
      this.orgId = params[ChatConstants.ORG_ID];
      this.token = params[ChatConstants.TOKEN];
      this.conversationId = params[ChatConstants.CONVERSATION_ID];
    });
    window.addEventListener('message', event => {
      this.showPopup = event.data?.showPopup;
      this.isMinimisedChatWindow = (this.showPopup === false);
    }, false);
  }

  ngOnInit(): void {
    if (this.route.snapshot) {
      this.staticData = this.route.snapshot.data;
      if (this.staticData.ResourceBundles) {
        this.route.snapshot.data.translate = this.staticData.ResourceBundles;
      }
    }
    if (this.externalShowPopupFrm) {
      this.showPopup = true;
      this.initializeChatBot();
    }
  }

  onOpenModalWindow(): void {
    if (!this.isMinimisedChatWindow){
      this.initializeChatBot();
    } else {
      const urls = this.constructIframeUrl({}, true);
      this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(urls);
    }
    this.showPopup = true;
  }
  closeModalWindow(): void {
    this.showPopup = false;
  }

  initializeChatBot(): void {
    if (!this.externalTokenIdFrm && !this.externalConversationIdFrm) {
      this.getCustomerSession();
    } else {
      const customerSession = {
        Token: this.externalTokenIdFrm,
        ConversationId: this.externalConversationIdFrm
      };
      const urls = this.constructIframeUrl(customerSession, true);
      this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(urls);
    }
  }

  getCustomerSession(): void {
    this.isLoading = true;
    if (this.orgId) {
      this.requestParam = { orgId: this.orgId };
    }
    this.chatservice.getCustomerSession(this.requestBody, this.requestParam).subscribe(response => {
      this.url = this.constructIframeUrl(response);
      this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
      this.isLoading = false;
    }, (error) => {
      this.isLoading = false;
    });
  }

  constructIframeUrl(customerSession: any, isFromExternal?: boolean): string {
    let url = '';
    if (window.location.origin.includes('localhost')) {
      url = window.location.origin + '/app/chat';
    } else {
      url = window.location.origin + '/selfservice/ui/app/chat';
    }
    if (customerSession?.Token) {
      this.token = customerSession?.Token;
    }
    if (customerSession?.ConversationId) {
      this.conversationId = customerSession?.ConversationId;
    }
    url = url + '?token=' + this.token;
    url = url + '&conversationId=' + this.conversationId;
    url = url + '&orgId=' + this.orgId;

    // TODO to remove below code once we move out of iframe within selfserve app -
    // to handle selfserve pages without greetings to display in conversation need to add isFromExternal flag
    if (isFromExternal) {
      url = url + '&isFromExternal=' + isFromExternal;
    }
    return url;
  }

}
