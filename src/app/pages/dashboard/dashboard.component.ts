import { MediaQueryService } from './../../services/media-query/media-query.service';
import { ChartOptionsCategory, Transition } from './../transitions/transitions';
import { DataPickerService } from './../../components/data-picker/data-picker.service';
import { UtilsService } from './../../services/utils/utils.service';
import { Component, effect, inject, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../components/pageheader/page-header.component';
import { pagesItems } from '../../constants/menu';
import { ApiService } from '../../services/api/api.service';
import { CardComponent } from '../../components/card/card.component';
import { ChartOptions } from '../transitions/transitions';
import { NgApexchartsModule } from 'ng-apexcharts';
import moment from 'moment';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, NgApexchartsModule, NgClass],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private apiService = inject(ApiService)
  protected mediaQueryService = inject(MediaQueryService);
  protected utilsService = inject(UtilsService);
  protected dataPickerService = inject(DataPickerService);

  protected pageItem = pagesItems['dashboard'];
  
  private incomings!: Transition[];
  private expenses!: Transition[];

  protected totalIncomings!: number;
  protected totalExpenses!: number;
  protected chartOptions!: Partial<ChartOptions>;
  protected chartOptionsCategory!: Partial<ChartOptionsCategory>;

  public showLoader = true;

  constructor() {
    effect(() => {
      this.dataPickerService.currentDateSignal();
      this.getTransitions();
    });
  }
  
  ngOnInit(): void {
    this.utilsService.loaders.showTransition.set(false);
    this.getTransitions();
  } 

  private getTransitions = () => {
    this.apiService.getTransitions().subscribe({
      next: (transitions_res) => {
        const receitasResponse = this.utilsService.convertGetFirebase(transitions_res?.receitas);
        const despesasResponse = this.utilsService.convertGetFirebase(transitions_res?.despesas);
        const incomingsFixed = this.utilsService.convertGetFirebase(transitions_res?.receitasFixas);
        const expensesFixed = this.utilsService.convertGetFirebase(transitions_res?.despesasFixas);

        this.incomings = this.utilsService.filterTransitionByDate(receitasResponse);
        this.expenses = this.utilsService.filterTransitionByDate(despesasResponse);

        if (incomingsFixed) {
          this.incomings.push(...incomingsFixed);
        }

        if (expensesFixed) {
          this.expenses.push(...expensesFixed);
        }
        
        this.totalIncomings = this.utilsService.totalTransitionAccumulator(this.incomings);
        this.totalExpenses = this.utilsService.totalTransitionAccumulator(this.expenses);
        
        this.showLoader = false;

        this.initChart();
      }
    })
  }

  private expensesByCategory = (values: 'CATEGORIA' | 'VALOR') => {
    return this.expenses.map(expense => values === 'CATEGORIA' ? expense.categoria : expense.valor);
  }

  private initChart = () => {
    this.chartOptions = {
      series: [
        {
          name: "Saldo Previsto",
          data: this.lastBalances()
        }
      ],
      chart: {
        type: "area",
        height: 350,

        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        categories: this.getNextFourMonths(),
      },
      yaxis: {
        title: {
          text: "Saldo (R$)"
        }
      },
      tooltip: {
        x: {
          format: "MM/yyyy"
        }
      },
      fill: {
        opacity: 0.5
      },
      title: {
        text: "Previsão de Saldos para os Próximos 4 Meses",
        align: "center"
      }
    };

    this.chartOptionsCategory = {
      series: this.expensesByCategory('VALOR'),
      chart: {
        type: "donut"
      },
      labels: this.expensesByCategory('CATEGORIA'),
      legend: {
        position: "bottom"
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  getNextFourMonths(): string[] {
    const months = [];
    for (let i = 0; i < 4; i++) {
      //Verificar se esse add('month') vira no ano para evitar bugs
      const nextDate = this.dataPickerService.currentDateSignal().clone().add(i, 'month').format('MMM / YYYY');
      const nexDateFormat = nextDate.charAt(0).toUpperCase() + nextDate.slice(1).toLowerCase();
      months.push(
        nexDateFormat
      );
    }
    return months;
  }

  // Gera dados de saldo para os próximos meses
  lastBalances = () => {
    let lastBalances = [];

    for (let i = 0; i < 4;  i++) {
      
      //Adicionar a variavel global par auser na função getNextFourMounths()
      const nextDates = this.dataPickerService.currentDateSignal().clone().add(i, 'month').format('MM/YYYY');
      
      //Filtra as receitas e pega o total de todas as receitas dos ultimos meses estipulados
      const incomingsFiltered = this.incomings.filter(incoming => moment(incoming.data).format('MM/YYYY') == nextDates);
      const totalIncomings = this.utilsService.totalTransitionAccumulator(incomingsFiltered);
      
      //Filtra as despesas e pega o total de todas as despesas dos ultimos meses estipulados
      const expenseFiltered = this.expenses.filter(incoming => moment(incoming.data).format('MM/YYYY') == nextDates);
      const totalExpenses = this.utilsService.totalTransitionAccumulator(expenseFiltered);

      const totalBalancos = totalIncomings - totalExpenses;
      lastBalances.push(totalBalancos);
    }

    return lastBalances;    
  }
}
