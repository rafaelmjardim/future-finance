import { MediaQueryService } from './../../services/media-query/media-query.service';
import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIcon, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  protected mediaQueryService = inject(MediaQueryService);
  private userService = inject(UserService);
  private autService = inject(AuthService);
  private router = inject(Router);

  protected handleLogout = () => {
    this.autService.signOut()
    .then(logout_response => {
      console.log('Fez logout', logout_response);
      this.userService.removeUserStorge();
      this.router.navigateByUrl('/login');
    })
    .catch(error_response => {
      console.log('Error: ', error_response);
    })
  }
}
