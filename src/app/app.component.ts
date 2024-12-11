import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { UserService } from './services/user/user.service';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    NgClass, 
    AngularFireAuthModule,
    HeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private userService = inject(UserService);
  protected authService = inject(AuthService);

  ngOnInit(): void {
    this.checkUserLogged();
  }
  
  checkUserLogged = () => {
    this.authService.isLogged.set(this.userService.getUserStorge() ? true : false);
  }
}
