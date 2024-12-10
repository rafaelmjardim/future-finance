import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireAuth: AngularFireAuth) { }

  signIn = (email: string, senha: string) => {
    return this.fireAuth.signInWithEmailAndPassword(email, senha);
  }

  signOut = () => {
    return this.fireAuth.signOut();
  }
}
