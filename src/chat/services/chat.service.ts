import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerRequest } from '../models/customer-request.model';
import { ServiceUrlConstants } from '../models/service-url-constant';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient, private utilService: UtilService) {}

  public getCustomerSession(
    requestBody: CustomerRequest,
    requestParams: RequestParam
  ): Observable<any> {
    const headers = this.utilService.getHeader();
    const params = this.utilService.getParam(requestParams);
    return this.http.post(
      ServiceUrlConstants.GET_CUSTOMER_SESSION,
      requestBody,
      { headers, params }
    );
  }

  public getDemoPageConfig(requestParams: RequestParam): Observable<any> {
    const headers = this.utilService.getHeader();
    const params = this.utilService.getParam(requestParams);
    return this.http.get(ServiceUrlConstants.GET_DEMOPAGE_CONFIG, {
      headers,
      params,
    });
  }

  public getChatConfig(requestParams: RequestParam): Observable<any> {
    const headers = this.utilService.getHeader();
    const params = this.utilService.getParam(requestParams);
    return this.http.get(ServiceUrlConstants.GET_VIRTUALASSISTANT_CONFIG, {
      headers,
      params,
    });
  }

  public getChatFeatureConfig(
    requestParams: RequestParam,
    isMainMenu: boolean
  ): Observable<any> {
    const headers = this.utilService.getHeader();
    requestParams.query = `MainMenu=${isMainMenu}`;
    const params = this.utilService.getParam(requestParams);
    return this.http.get(
      ServiceUrlConstants.GET_VIRTUALASSISTANT_FEATURE_CONFIG,
      { headers, params }
    );
  }
}

export class RequestParam {
  orgId?: string;
  token?: string;
  locale?: string;
  orderId?: string;
  orderType?: string;
  localeId?: string;
  bundleNames?: string;
  locationId?: string;
  grpDateFormat?: string;
  query?: string;
  page?: string;
  size?: string;
  sort?: string;
  postalCode?: string;
  countryCode?: string;
  city?: string;
  state?: string;
  radius?: number;
  radiusUOM?: string;
  userId?: string;
  bundlesName?: string;
  selfServiceConfigId?: string;
  cartId?: string;
  isShort?: boolean;
  conversationId?: string;
  condition?: string;
  packVersion?: string;
  extensionPackId?: string;
  CountryId?: string;
  isGiftReturn?: string;
}
