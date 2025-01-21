import { inject, Injectable, signal } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { BehaviorSubject } from 'rxjs';
import moment from 'moment';
import { Router } from '@angular/router';
import {  } from "@angular/cdk/";

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

  register = async (nome: string, email: string, senha: string) => {
    return this.fireAuth.createUserWithEmailAndPassword(email, senha);
  }

  signOut = () => {
    return this.fireAuth.signOut();
  }

  checkTokenExpired = () => {
    this.fireAuth.authState.subscribe(async (user) => {
      const tokenResult = await user?.getIdTokenResult();    
      const authTime = moment(tokenResult?.authTime).format(); //Horario que usuario logou
      const isExpired = moment().format() > moment(authTime).add(1, 'h').format(); //Caso o horario do usuario logado passe de 1hora ele expirai            

      if (isExpired) {
        this.signOut()
        .then(logout_response => {
          console.log('Login expirado', logout_response);
          this.router.navigateByUrl('/login');
        })
        .catch(error_response => {
          console.log('Error: ', error_response);
        })
      }
    });
  }
}
