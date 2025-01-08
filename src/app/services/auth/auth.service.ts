import { inject, Injectable, signal } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { BehaviorSubject } from 'rxjs';
import moment from 'moment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticated.asObservable();

  private fireAuth = inject(AngularFireAuth);
  private router = inject(Router);

  constructor () {
    this.fireAuth.authState.subscribe((user) => {
      this.isAuthenticated.next(!!user);
    });
  }

  signIn = (email: string, senha: string) => {
    return this.fireAuth.signInWithEmailAndPassword(email, senha);
  }

  signOut = () => {
    return this.fireAuth.signOut();
  }

  checkTokenExpired = () => {
    this.fireAuth.authState.subscribe(async (user) => {
      const tokenResult = await user?.getIdTokenResult();    
      const expirationTime = moment(tokenResult?.expirationTime).diff(moment());
      const isExpired = expirationTime < 0;
  
      if (isExpired) {
        this.signOut()
        .then(logout_response => {
          console.log('Token expirado', logout_response);
          this.router.navigateByUrl('/login');
        })
        .catch(error_response => {
          console.log('Error: ', error_response);
        })
      }
    });
  }
}
