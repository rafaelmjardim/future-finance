import { Component, inject } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ButtonComponent } from '../button/button.component';
import { RouterLink } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { SheetComponent } from '../sheet/sheet.component';

@Component({
  selector: 'app-navbar-mobile',
  standalone: true,
  imports: [NgIcon, ButtonComponent, RouterLink],
  templateUrl: './navbar-mobile.component.html',
  styleUrl: './navbar-mobile.component.scss'
})
export class NavbarMobileComponent {
  private dialog = inject(Dialog);

  public openSheet = () => {
    this.dialog.open(SheetComponent);
  }

}
