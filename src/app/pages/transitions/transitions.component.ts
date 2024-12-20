import { TransitionsListComponent } from './transitions-list/transitions-list.component';
import { Component, effect, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { ApiService } from '../../services/api/api.service';
import { UtilsService } from '../../services/utils/utils.service';
import { User } from '../../services/user/user';
import { PageHeaderComponent } from '../../components/pageheader/page-header.component';
import { pagesItems } from '../../constants/menu';
import { ChartOptions, Transition } from './transitions';
import { CardComponent } from '../../components/card/card.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SheetService } from '../../components/sheet/sheet.service';

@Component({
  selector: 'app-transitions',
  standalone: true,
  imports: [PageHeaderComponent, TransitionsListComponent, CardComponent, NgApexchartsModule],
  templateUrl: './transitions.component.html',
  styleUrl: './transitions.component.scss'
})
export class TransitionsComponent implements OnInit {
  private userService = inject(UserService);
  private api = inject(ApiService);
  private utilsService = inject(UtilsService);
  private sheetService = inject(SheetService);
  
  protected user: User = this.userService.getUserStorge();

  protected pageItem = pagesItems['transacoes'];

  protected incomings: Transition[] = [];
  protected expenses: Transition[] = [];

  protected totalIncomings!: number;
  protected totalExpenses!: number;

  protected chartOptions!: Partial<ChartOptions>;
  
  constructor() {
    effect(() => {
      if (this.sheetService.reloadTransitionsSignal()) {
        this.getTransitions();
      }
    })
  }

  ngOnInit(): void {
    this.getTransitions();
  }

  getTransitions = () => {
    if (!this.user) {
      return
    }

    this.api.getTransitions(this.user.uid).subscribe({
      next: (transitions_response) => {
        console.log('transitions', transitions_response);
        this.incomings = this.utilsService.convertGetFirebase(transitions_response.receitas);
        this.expenses = this.utilsService.convertGetFirebase(transitions_response.despesas);
        this.totalIncomings = this.totalTransitionAccumulator(this.incomings);
        this.totalExpenses = this.totalTransitionAccumulator(this.expenses);
        this.initChart()
      }
    })
  }

  totalTransitionAccumulator = (transitions: Transition[]) => {
    return transitions.reduce((previuValue, currentValue) => {
      return previuValue + currentValue.valor;
    }, 0);
  }

  initChart = () => {
    this.chartOptions = {
      series: [
        {
          name: "Receita",
          data: [this.totalIncomings],
          color: "#6e9c90"
        },
        {
          name: "Despesa",
          data: [this.totalExpenses],
          color: "#D33535"
        }
      ],
      chart: {
        height: 350,
        type: "bar",
      },
      xaxis: {
        categories: ['Janeiro'],
        title: {
          text: 'Meses',
        },
      },
      yaxis: {
        title: {
          text: 'Valores (R$)',
        },
      },
    }
  }
}
