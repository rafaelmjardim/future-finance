import { inject, Injectable, signal } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { UserService } from '../user/user.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticated.asObservable();

  private fireAuth = inject(AngularFireAuth);

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
}
