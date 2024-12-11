import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private userService = inject(UserService);
  private autService = inject(AuthService);
  private router = inject(Router);

  protected handleLogout = () => {
    this.autService.signOut()
    .then(logout_response => {
      console.log('Fez logout', logout_response);
      this.userService.removeUserStorge();
      this.autService.isLogged.set(false);
      this.router.navigateByUrl('/login');
    })
    .catch(error_response => {
      console.log('Error: ', error_response);
    })
  }
}
