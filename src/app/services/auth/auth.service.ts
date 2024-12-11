import { inject, Injectable, signal } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private fireAuth = inject(AngularFireAuth);
  public isLogged = signal(false);

  signIn = (email: string, senha: string) => {
    return this.fireAuth.signInWithEmailAndPassword(email, senha);
  }

  signOut = () => {
    return this.fireAuth.signOut();
  }
}
