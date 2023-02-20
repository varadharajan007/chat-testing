import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor() {}
  /**
   * Return http header
   */
  getHeader(): HttpHeaders {
    let header = new HttpHeaders();
    header = header.set('Content-Type', 'application/json');
    return header;
  }

  /**
   * Take RequestParam object and convert it to http param
   */
  getParam(paramsList: RequestParam): HttpParams {
    let params = new HttpParams();
    if (paramsList) {
      for (const [key, value] of Object.entries(paramsList)) {
        if (value) {
          params = params.set(key, value);
        }
      }
    }
    return params;
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
