import { Component, inject } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ButtonComponent } from '../button/button.component';
import { Router, RouterLink } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { SheetComponent } from '../sheet/sheet.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-navbar-mobile',
  standalone: true,
  imports: [NgIcon, ButtonComponent, RouterLink, NgClass],
  templateUrl: './navbar-mobile.component.html',
  styleUrl: './navbar-mobile.component.scss'
})
export class NavbarMobileComponent {
  private dialog = inject(Dialog);
  protected router = inject(Router);

  public openSheet = () => {
    this.dialog.open(SheetComponent);
  }

}
