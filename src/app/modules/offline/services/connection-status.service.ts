import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionStatusService implements HttpInterceptor {

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(!window.navigator.onLine){
      const  error = {
        status:0,
        error:{
          description:"check connectivity"
        },
        statusText:"check connectivity"
      };
      return throwError  (new HttpErrorResponse(error));
    }else{
      return next.handle(req)
    }
    }
  }

