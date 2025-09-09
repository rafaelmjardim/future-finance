import { UtilsService } from './services/utils/utils.service';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth/auth.service';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarService } from './components/sidebar/sidebar.service';
import { NavbarMobileComponent } from './components/navbar-mobile/navbar-mobile.component';
import { MediaQueryService } from './services/media-query/media-query.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    AsyncPipe,
    HeaderComponent,
    SidebarComponent,
    NavbarMobileComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected authService = inject(AuthService);  
  protected mediaQueryService = inject(MediaQueryService);
  protected sidebarService = inject(SidebarService);
  protected utilsService = inject(UtilsService);  
}
