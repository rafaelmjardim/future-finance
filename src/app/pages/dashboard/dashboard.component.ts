import { ApiService } from '../../services/api/api.service';
import { User } from '../../services/user/user';
import { UtilsService } from '../../services/utils/utils.service';
import { UserService } from './../../services/user/user.service';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  private userService = inject(UserService);
  private api = inject(ApiService);
  private utilsService = inject(UtilsService);
  protected user: User = this.userService.getUserStorge();
  
  ngOnInit(): void {
  } 
}
