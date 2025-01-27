import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  if(sessionStorage.getItem('accessToken') && sessionStorage.getItem('refreshToken')){
    return true;
  }
  else {
    return false;
  }
};
