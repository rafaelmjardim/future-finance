import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { SheetService } from '../../../domain/transactions/components/sheet/sheet.service';
import { menu, pagesItems } from '../../../constants/menu';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SidebarService } from './sidebar.service';
import { UtilsService } from '../../../shared/services/utils/utils.service';
import { Menu } from './sidebar';

@Component({
  selector: 'app-sidebar',
  imports: [NgIcon, NgClass, RouterLink, ButtonComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  protected router = inject(Router);
  protected sheetService = inject(SheetService);
  protected sidebarService = inject(SidebarService);
  protected utilsService = inject(UtilsService);

  protected menu: Menu[] = [
    {
      txt: 'Dashboard',
      icon: 'lucideLayoutPanelLeft',
      rota: '/dashboard',
      strokeWidth: '1.5',
    },
    {
      txt: 'Transações',
      icon: 'ionSwapHorizontalOutline',
      rota: '/transacoes',
    },
    {
      txt: 'Conta',
      icon: 'ionPersonOutline',
      rota: '/account',
    },
    {
      txt: 'Config',
      icon: 'ionSettingsOutline',
      rota: '/config',
    },
  ];
}
