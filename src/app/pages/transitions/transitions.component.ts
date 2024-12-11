import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { ApiService } from '../../services/api/api.service';
import { UtilsService } from '../../services/utils/utils.service';
import { User } from '../../services/user/user';

@Component({
  selector: 'app-transitions',
  standalone: true,
  imports: [],
  templateUrl: './transitions.component.html',
  styleUrl: './transitions.component.scss'
})
export class TransitionsComponent implements OnInit {
  private userService = inject(UserService);
  private api = inject(ApiService);
  private utilsService = inject(UtilsService);
  protected user: User = this.userService.getUserStorge();

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
