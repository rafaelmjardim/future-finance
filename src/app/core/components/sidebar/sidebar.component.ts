import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { SheetService } from '../../../domain/transactions/components/sheet/sheet.service';
import { menu, pagesItems } from '../../../constants/menu';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SidebarService } from './sidebar.service';
import { UtilsService } from '../../../shared/services/utils/utils.service';

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
  protected sidebarService = inject(SidebarService);
  protected utilsService = inject(UtilsService);

  protected menu = menu;
}
