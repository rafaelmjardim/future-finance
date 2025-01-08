import { AuthService } from './../services/auth/auth.service';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { User } from '../services/user/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import moment from 'moment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  const authService = inject(AuthService);
  const user: User = userService.getUserStorge();

  authService.checkTokenExpired();
  
  const modifiedUrl = req.url.replace('/usuarios', `/usuarios/${user.uid}`);
  const token = localStorage.getItem('token');  
  
  if (!token) return next(req);

  const modifiedReq = req.clone({
    url: modifiedUrl,
    params: req.params.set('auth', token)
  });
    
  return next(modifiedReq);
};
 
