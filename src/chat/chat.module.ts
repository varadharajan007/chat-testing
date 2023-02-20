import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { FormsModule } from '@angular/forms';
import { ChatRoutingModule } from './chat-routing.module';
import { MatExpansionModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { ChatScreenComponent } from './chat-screen/chat-screen.component';
import {MatCardModule} from '@angular/material';
import { WidgetsModule } from '../chat/widgets/widgets.module';
import { ChatModalModule } from '../chat/chat-modal/chat-modal.module';
import { SharedModule } from './shared.module';

@NgModule({
  declarations: [ChatComponent, ChatScreenComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ChatRoutingModule,
    MatExpansionModule,
    MatIconModule,
    MatCardModule,
    WidgetsModule,
    ChatModalModule
  ]
})
export class ChatModule { }
