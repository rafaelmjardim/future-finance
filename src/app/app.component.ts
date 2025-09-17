import { UtilsService } from './shared/services/utils/utils.service';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { AuthService } from './shared/services/auth/auth.service';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { SidebarService } from './core/components/sidebar/sidebar.service';
import { NavbarMobileComponent } from './core/components/navbar-mobile/navbar-mobile.component';
import { MediaQueryService } from './shared/services/media-query/media-query.service';

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
