import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { ChatService } from './chat.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatResolver implements Resolve<boolean> {
  constructor(private router: Router, private chatService: ChatService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const org = route.queryParamMap.get('orgId');
    const token = route.queryParamMap.get('token');
    const conversationId = route.queryParamMap.get('conversationId');
    if (token && conversationId) {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('conversationId', conversationId);
    }
    return this.isChatEnabled(org) || observableOf(null);
  }

  isChatEnabled(org: any): Observable<boolean> {
    return this.chatService.getComponentProperty(org).pipe(
      map((response: any) => {
        const domain = new URL(document.URL);
        return response?.data?.HostUrl === domain.origin ? true : false;
      }),
      catchError((error) => {
        return observableOf(false);
      })
    );
  }
}
