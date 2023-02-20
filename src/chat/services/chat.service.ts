import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerRequest } from '../models/customer-request.model';
import { ServiceUrlConstants } from '../models/service-url-constant';
import { RequestParam } from '../../core/services/request-param.model';
import { UtilService } from '../../core/services/util.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient, private utilService: UtilService) { }

  public getCustomerSession(requestBody: CustomerRequest, requestParams: RequestParam): Observable<any> {
    const headers = this.utilService.getHeader();
    const params = this.utilService.getParam(requestParams);
    return this.http.post(ServiceUrlConstants.GET_CUSTOMER_SESSION, requestBody, { headers, params });
  }

  public getDemoPageConfig(requestParams: RequestParam): Observable<any> {
    const headers = this.utilService.getHeader();
    const params = this.utilService.getParam(requestParams);
    return this.http.get(ServiceUrlConstants.GET_DEMOPAGE_CONFIG, { headers, params });
  }

  public getChatConfig(requestParams: RequestParam): Observable<any> {
    const headers = this.utilService.getHeader();
    const params = this.utilService.getParam(requestParams);
    return this.http.get(ServiceUrlConstants.GET_VIRTUALASSISTANT_CONFIG, { headers, params });
  }

  public getChatFeatureConfig(requestParams: RequestParam, isMainMenu: boolean): Observable<any> {
    const headers = this.utilService.getHeader();
    requestParams.query = `MainMenu=${isMainMenu}`;
    const params = this.utilService.getParam(requestParams);
    return this.http.get(ServiceUrlConstants.GET_VIRTUALASSISTANT_FEATURE_CONFIG, { headers, params });
  }
}
