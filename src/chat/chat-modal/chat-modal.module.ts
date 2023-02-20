import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatFloatbuttonComponent } from './chat-floatbutton/chat-floatbutton.component';

@NgModule({
  declarations: [ChatFloatbuttonComponent],
  imports: [
    CommonModule
  ],
  exports: [
    ChatFloatbuttonComponent
  ]
})
export class ChatModalModule { }
