import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { Menu } from './sidebar';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIcon, NgClass, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  protected router = inject(Router);

  protected menu: Menu[] = [
    {
      txt: 'Dashboard',
      icon: 'lucideLayoutPanelLeft',
      rota: '/dashboard',
      strokeWidth: '1.5'
    },
    {
      txt: 'Transações',
      icon: 'ionSwapHorizontalOutline',
      rota: '/transacoes',
    }
  ];

}
