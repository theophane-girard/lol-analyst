import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../config/config';
import { environment } from '../../../environments/environment';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!httpRequest.params.get('isDataDragon')) {
      return this.formatRiotRequest(httpRequest, next)
    }

    return next.handle(httpRequest)
  }

  formatRiotRequest(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiKey = environment.CREDENTIALS.apiKey
    let a = environment.riotBaseUrl + httpRequest.url
    return next.handle(httpRequest.clone({
      url: environment.riotBaseUrl + httpRequest.url
    }));
  }
}