import { TransitionsListComponent } from './transitions-list/transitions-list.component';
import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { ApiService } from '../../services/api/api.service';
import { UtilsService } from '../../services/utils/utils.service';
import { User } from '../../services/user/user';
import { PageHeaderComponent } from '../../components/pageheader/page-header.component';
import { pagesItems } from '../../constants/menu';
import { Transition } from './transitions';

@Component({
  selector: 'app-transitions',
  standalone: true,
  imports: [PageHeaderComponent, TransitionsListComponent],
  templateUrl: './transitions.component.html',
  styleUrl: './transitions.component.scss'
})
export class TransitionsComponent implements OnInit {
  private userService = inject(UserService);
  private api = inject(ApiService);
  private utilsService = inject(UtilsService);
  protected user: User = this.userService.getUserStorge();

  protected pageItem = pagesItems['transacoes'];

  protected incomings: Transition[] = [
    {
      title: 'Receita titulo',
      icon: 'ionCashOutline',
      date: '20 jul, 12:30',
      status: false,
      value: 2500
    },

  ]

  protected expenses: Transition[] = [
    {
      title: 'Despesa titulo',
      icon: 'ionCashOutline',
      date: '20 jul, 12:30',
      status: false,
      value: 1500
    },
    {
      title: 'Despesa titulo',
      icon: 'ionCashOutline',
      date: '20 jul, 12:30',
      status: false,
      value: 1500
    },
    {
      title: 'Despesa titulo',
      icon: 'ionCashOutline',
      date: '20 jul, 12:30',
      status: false,
      value: 1500
    },

  ]

  ngOnInit(): void {
    this.getDespesas();
  }

  getDespesas = () => {
    if (!this.user) {
      return
    }

    this.api.getDespesas(this.user.uid).subscribe(despesas_response => {
      const despesas = this.utilsService.convertGetFirebase(despesas_response);
      console.log('Get despesas', despesas);
    })
  }

  postDespesa = () => {  
    if (!this.user) {
      console.log('Usuario não autenticado!');
      return  
    }
    
    this.api.postDespesa(this.user.uid).subscribe(res => {
      console.log('post success', res);
    })
  }

}
