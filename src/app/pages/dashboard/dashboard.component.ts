import { User } from '../../services/user/user';
import { UserService } from './../../services/user/user.service';
import { Component, inject, OnInit } from '@angular/core';
import { Dialog } from "@angular/cdk/dialog";
import { SheetComponent } from '../../components/sheet/sheet.component';
import { PageHeaderComponent } from '../../components/pageheader/page-header.component';
import { pagesItems } from '../../constants/menu';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PageHeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private userService = inject(UserService);
  protected user: User = this.userService.getUserStorge();

  private dialog = inject(Dialog);
  
  protected pageItem = pagesItems['dashboard'];
  
  ngOnInit(): void {
  } 

  openDialog() {
    this.dialog.open(SheetComponent, {
    })
  }
}
