import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { SheetService } from '../sheet/sheet.service';
import { menu, pagesItems } from '../../constants/menu';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIcon, NgClass, RouterLink, ButtonComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  protected router = inject(Router);
  protected sheetService = inject(SheetService);

  protected menu = menu;
}
