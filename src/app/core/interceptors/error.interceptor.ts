// interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID, Injector } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, throwError, timer } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);
  const platformId = inject(PLATFORM_ID);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
     
      if (isPlatformBrowser(platformId)) {
    
        timer(0).subscribe(() => {
          try {
            const toastr = injector.get(ToastrService);
            
            const { message, title } = getErrorDetails(error);
            toastr.error(message, title);
            
          } catch (injectionError) {
            console.error('ToastrService not available:', injectionError);
  
            const fallbackMessage = `Error: ${error?.error?.message || error.message || 'An unexpected error occurred'}`;
            alert(fallbackMessage);
          }
        });
      }
      
     
      return throwError(() => error);
    })
  );
};


function getErrorDetails(error: HttpErrorResponse): { message: string; title: string } {
  let message = 'An unexpected error occurred';
  let title = 'Error';

  if (error.status === 0) {
    message = 'Unable to connect to server. Please check your internet connection.';
    title = 'Connection Error';
  } else if (error.status >= 400 && error.status < 500) {
    message = error?.error?.message || 'Invalid request. Please check your input.';
    title = 'Client Error';
  } else if (error.status >= 500) {
    message = error?.error?.message || 'Server error. Please try again later.';
    title = 'Server Error';
  } else {
    message = error?.error?.message || error.message || message;
  }

  return { message, title };
}
