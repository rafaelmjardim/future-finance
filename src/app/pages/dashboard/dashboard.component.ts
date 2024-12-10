import { UserService } from './../../services/user/user.service';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private userService = inject(UserService);

  protected user = this.userService.getUserStorge();

}
