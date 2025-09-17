import { UtilsService } from '../../../shared/services/utils/utils.service';
import { MediaQueryService } from '../../../shared/services/media-query/media-query.service';
import { Component, inject } from '@angular/core';
import { UserService } from '../../../shared/services/user/user.service';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { NgClass } from '@angular/common';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIcon, NgClass, CdkMenu, CdkMenuItem, CdkMenuTrigger],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected mediaQueryService = inject(MediaQueryService);
  protected utilsService = inject(UtilsService);
  private userService = inject(UserService);
  private autService = inject(AuthService);
  private router = inject(Router);

  protected menuList: { icon: string; txt: string; actionFunc: Function }[] = [
    {
      icon: 'ionSparklesOutline',
      txt: 'Upgrade Premium',
      actionFunc: () => '',
    },
    {
      icon: 'ionSettingsOutline',
      txt: 'Config',
      actionFunc: () => this.changeDarkMode(),
    },
    {
      icon: 'ionPersonOutline',
      txt: 'Conta',
      actionFunc: () => {},
    },
    {
      icon: 'lucideLogOut',
      txt: 'Sair',
      actionFunc: () => this.handleLogout(),
    },
  ];

  protected handleLogout = () => {
    this.autService
      .signOut()
      .then((logout_response) => {
        console.log('Fez logout', logout_response);
        this.userService.removeUserStorge();
        this.router.navigateByUrl('/login');
      })
      .catch((error_response) => {
        console.log('Error: ', error_response);
      });
  };

  protected changeDarkMode = () => {
    this.utilsService.darkModeSignal.update((value) => !value);
  };
}
