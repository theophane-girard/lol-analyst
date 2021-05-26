import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CREDENTIALS } from '../../../config/credentials';
import { CONFIG } from '../../../config/config';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!httpRequest.params.get('isDataDragon')) {
      return this.formatRiotRequest(httpRequest, next)
    }

    return next.handle(httpRequest)
  }

  formatRiotRequest(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiKey = CREDENTIALS.apiKey
    return next.handle(httpRequest.clone({ 
      setHeaders: { 'X-Riot-Token': apiKey },
      url: CONFIG.apiUrl + httpRequest.url
    }));
  }
}