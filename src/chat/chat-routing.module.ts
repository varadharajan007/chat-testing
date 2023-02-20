import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatScreenComponent } from './chat-screen/chat-screen.component';

import { ChatComponent } from './chat.component';

const routes: Routes = [
  { path: '', component: ChatComponent },
  { path: 'dsschat' , component: ChatScreenComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
