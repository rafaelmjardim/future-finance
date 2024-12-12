import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { UserService } from './services/user/user.service';
import { AuthService } from './services/auth/auth.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionAddOutline, ionSettings, ionSwapHorizontalOutline } from '@ng-icons/ionicons';
import { lucideLayoutDashboard, lucideLayoutPanelLeft, lucideLogOut } from '@ng-icons/lucide';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    AsyncPipe,
    NgClass, 
    HeaderComponent,
    SidebarComponent,
  ],
  viewProviders: [provideIcons({ ionSettings, ionAddOutline, ionSwapHorizontalOutline, lucideLogOut, lucideLayoutPanelLeft, lucideLayoutDashboard })],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  protected authService = inject(AuthService);  

  ngOnInit(): void {
  }
  
}
