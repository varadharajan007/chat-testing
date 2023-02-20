import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatModalModule } from '../chat/chat-modal/chat-modal.module';

@NgModule({
  declarations: [
  
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChatModalModule,
  ],
  exports: [
    CommonModule
  ],
  providers: [
  ]
})
export class SharedModule { }
