import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CREDENTIALS } from 'src/config/credentials';
import { CONFIG } from 'src/config/config';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiKey = CREDENTIALS.apiKey
    return next.handle(httpRequest.clone({ 
      setHeaders: { 'X-Riot-Token': apiKey },
      url: CONFIG.apiUrl + httpRequest.url
    }));
  }
}