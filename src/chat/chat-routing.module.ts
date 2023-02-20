import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatScreenComponent } from './chat-screen/chat-screen.component';

import { ChatComponent } from './chat.component';
import { ChatResolver } from './services/chat-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}
