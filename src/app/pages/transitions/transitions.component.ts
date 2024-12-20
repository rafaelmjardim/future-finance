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
import { DataPickerService } from '../../components/data-picker/data-picker.service';
import moment from 'moment';

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
  protected dataPickerService = inject(DataPickerService);
  
  protected user: User = this.userService.getUserStorge();

  protected pageItem = pagesItems['transacoes'];

  protected incomings: Transition[] = [];
  protected expenses: Transition[] = [];

  protected totalIncomings!: number;
  protected totalExpenses!: number;

  protected chartOptions!: Partial<ChartOptions>;

  private todayDate = moment();
  
  constructor() {
    effect(() => {
      if (this.sheetService.reloadTransitionsSignal()) {
        this.getTransitions();
        //Verificar, talvez tenha que setar para false o reload pois não vá reconhecer segunda transação seguida (signal não atualiza mesmo valor caso n tenha mudança)
      }

     this.dataPickerService.currentDateSignal();
     this.getTransitions(); //Get duplicado, resolver depois
    })
  }

  ngOnInit(): void {
    this.getTransitions();
  }

  getTransitions = () => {
    if (!this.user) return;

    this.api.getTransitions(this.user.uid).subscribe({
      next: (transitions_response) => {
        const receitasResponse = this.utilsService.convertGetFirebase(transitions_response.receitas);
        const despesasResponse = this.utilsService.convertGetFirebase(transitions_response.despesas);

        this.incomings = this.filterTransitionByDate(receitasResponse);
        this.expenses = this.filterTransitionByDate(despesasResponse);          

        this.totalIncomings = this.totalTransitionAccumulator(this.incomings);
        this.totalExpenses = this.totalTransitionAccumulator(this.expenses);
        this.initChart();
      }
    })
  }

  totalTransitionAccumulator = (transitions: Transition[]) => {
    return transitions.reduce((previuValue, currentValue) => {
      return previuValue + currentValue.valor;
    }, 0);
  }

  filterTransitionByDate = (transitions: Transition[]) => {
    return transitions.filter(transition => {
      return moment(transition.data).month() == this.dataPickerService.currentDateSignal().month()
    });    
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
