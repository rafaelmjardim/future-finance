import { User } from '../../services/user/user';
import { UserService } from './../../services/user/user.service';
import { Component, inject, OnInit } from '@angular/core';
import { Dialog } from "@angular/cdk/dialog";
import { SheetComponent } from '../../components/sheet/sheet.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private userService = inject(UserService);
  protected user: User = this.userService.getUserStorge();

  private dialog = inject(Dialog);
  
  ngOnInit(): void {
  } 

  openDialog() {
    this.dialog.open(SheetComponent, {
    })
  }
}
