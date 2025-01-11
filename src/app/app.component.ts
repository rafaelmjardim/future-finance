import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth/auth.service';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarService } from './components/sidebar/sidebar.service';

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
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  protected authService = inject(AuthService);  

  protected sidebarService = inject(SidebarService);

  ngOnInit(): void {
  }
  
}
