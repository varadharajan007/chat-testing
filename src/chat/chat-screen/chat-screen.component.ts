import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatConstants } from '../models/chat-constants';
import { CustomerRequest } from '../models/customer-request.model';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'dss-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatScreenComponent implements OnInit {
  public config: any;
  public chatBotConfigEnabled = false;
  errorMessage: any;
  public isError = false;
  requestParam: HttpParams | any = {};
  requestBody: CustomerRequest = {};
  orgId: any;
  token: any;
  conversationId: any;
  isLoading = false;

  constructor(private chatservice: ChatService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.orgId = params[ChatConstants.ORG_ID];
      this.token = params[ChatConstants.TOKEN];
      this.conversationId = params[ChatConstants.CONVERSATION_ID];
    });
  }

  ngOnInit(): void {
    if (this.orgId) {
      this.requestParam = { orgId: this.orgId, Token: this.token, conversationId: this.conversationId };
    }
    this.isChatEnabled();
  }

  isChatEnabled(): void {
    this.isLoading = true;
    this.chatservice.getDemoPageConfig(this.requestParam).subscribe((response) => {

      if (response?.data === true) {
        this.checkVirtualAssistantConfigEnabled();
        this.isLoading = false;
      } else {
        //this.errorMessage = this.translate.transform('chatbotComingSoon_TC');
        this.isLoading = false;
      }
    }, (error) => {
      this.chatBotConfigEnabled = false;
     // this.errorMessage = this.translate.transform('unableToProcessRequest_TC');
      this.isLoading = false;
    });
  }

  checkVirtualAssistantConfigEnabled(): void {
    this.isLoading = true;
    this.chatservice.getChatConfig(this.requestParam).subscribe(response => {
      if (response) {
        this.chatBotConfigEnabled = response?.data?.EnableAssistant;
      }
      if (!this.chatBotConfigEnabled) {
        //this.errorMessage = this.translate.transform('chatbotComingSoon_TC');
      }
      this.isLoading = false;
    }, (error) => {
      this.chatBotConfigEnabled = false;
      //this.errorMessage = this.translate.transform('unableToProcessRequest_TC');
      this.isLoading = false;
    });
  }

}
