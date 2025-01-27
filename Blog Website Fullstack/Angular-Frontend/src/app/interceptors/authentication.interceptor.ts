import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { BlogService } from '../services/blog.service'

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {

  const blogService = inject(BlogService);

  const request = req.clone({
   headers:req.headers.set(
     'Authorization',`Bearer ${sessionStorage.getItem('accessToken')}`
   )
    });
  return next(request).pipe(
    catchError((error:HttpErrorResponse)=>{
      if(error.status === 401){
        const isRefresh:boolean = confirm('Your session is expired , Do you want to continue ?');
        if(isRefresh){
          blogService.$refreshToken.next(true);
        }
        else{
          blogService.onLogout();
        }
      }
      return throwError(error)
    }
    ));
};
