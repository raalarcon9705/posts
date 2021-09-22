import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private _cache = new Map<string, HttpResponse<any>>();

  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.method !== 'GET') {
      return next.handle(request);
    }
    if (request.headers.get('reset')) {
      this._cache.delete(request.urlWithParams);
    }
    const cacheResponse = this._cache.get(request.urlWithParams);

    if (cacheResponse) {
      return of(cacheResponse.clone());
    }
    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this._cache.set(request.urlWithParams, event.clone());
        }
      })
    );
  }
}
