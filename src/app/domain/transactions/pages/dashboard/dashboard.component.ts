import { MediaQueryService } from '../../../../shared/services/media-query/media-query.service';
import { DataPickerService } from '../../../../shared/components/data-picker/data-picker.service';
import { UtilsService } from '../../../../shared/services/utils/utils.service';
import { Component, effect, inject, OnInit } from '@angular/core';
import { pagesItems } from '../../../../constants/menu';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import moment from 'moment';
import { TransactionApi } from '../../apis/transaction.api';
import { PageHeaderComponent } from '../../../../shared/components/pageheader/page-header.component';
import { filter } from 'rxjs';
import { ChartOptions, ChartOptionsCategory, Transaction } from '../../interfaces/interfaces';
import { TransactionsService } from '../../services/transactions.service';

@Component({
  selector: 'app-dashboard',
  imports: [PageHeaderComponent, CardComponent, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly _transactionsService = inject(TransactionsService);
  private apiService = inject(TransactionApi);
  protected mediaQueryService = inject(MediaQueryService);
  protected utilsService = inject(UtilsService);
  protected dataPickerService = inject(DataPickerService);

  protected pageItem = pagesItems['dashboard'];

  private incomings!: Transaction[];
  private expenses!: Transaction[];

  protected totalIncomings!: number;
  protected totalExpenses!: number;
  protected chartOptions!: Partial<ChartOptions> | any;
  protected chartOptionsCategory!: Partial<ChartOptionsCategory> | Partial<any>;

  public showLoader = true;

  constructor() {
    effect(() => {
      this.dataPickerService.currentDateSignal();
      this.getTransactions();
    });
  }

  ngOnInit(): void {
    this._transactionsService.loaders.showTransaction.set(false);
    this.getTransactions();
  }

  private getTransactions = () => {
    this.apiService
      .getTransactions()
      .pipe(filter((transactions) => !!transactions))
      .subscribe({
        next: ({ receitas, despesas }) => {
          const receitasResponse = this.utilsService.convertGetFirebase(receitas);
          const despesasResponse = this.utilsService.convertGetFirebase(despesas);

          this.incomings = this._transactionsService.filterTransactionByDate(receitasResponse);
          this.expenses = this._transactionsService.filterTransactionByDate(despesasResponse);

          const currentMonthDataPicker = this.dataPickerService
            .currentDateSignal()
            .format('YYYY-MM');

          this.incomings = this._transactionsService.checkAndSetRepeatTransactions(
            this.incomings,
            currentMonthDataPicker
          );
          this.expenses = this._transactionsService.checkAndSetRepeatTransactions(
            this.expenses,
            currentMonthDataPicker
          );

          this.totalIncomings = this._transactionsService.totalTransactionAccumulator(
            this.incomings
          );
          this.totalExpenses = this._transactionsService.totalTransactionAccumulator(this.expenses);

          this.showLoader = false;

          this.initChart();
        },
      });
  };

  private expensesByCategory = (values: 'CATEGORIA' | 'VALOR') => {
    return this.expenses.map((expense) =>
      values === 'CATEGORIA' ? expense.categoria : expense.valor
    );
  };

  private initChart = () => {
    this.chartOptions = {
      series: [
        {
          name: 'Saldo Previsto',
          data: this.lastBalances(),
        },
      ],
      chart: {
        type: 'area',
        height: 350,

        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: this.getNextFourMonths(),
      },
      yaxis: {
        title: {
          text: 'Saldo (R$)',
        },
      },
      tooltip: {
        x: {
          format: 'MM/yyyy',
        },
      },
      fill: {
        opacity: 0.5,
      },
      title: {
        text: 'Previsão de Saldos para os Próximos 4 Meses',
        align: 'center',
      },
    };

    this.chartOptionsCategory = {
      series: this.expensesByCategory('VALOR'),
      chart: {
        type: 'donut',
      },
      stroke: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      labels: this.expensesByCategory('CATEGORIA'),
      legend: {
        position: 'bottom',
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontFamily: 'Inter, sans-serif',
                offsetY: 20,
              },
              total: {
                showAlways: true,
                show: true,
                label: 'Despesas totais',
                // fontFamily: "Inter, sans-serif",
                formatter: (w) => {
                  const sum = w.globals.seriesTotals.reduce((a: any, b: any) => {
                    return a + b;
                  }, 0);
                  return 'R$' + sum + 'k';
                },
              },
              value: {
                show: true,
                fontWeight: 600,
                // fontFamily: "Inter, sans-serif",
                offsetY: -20,
                formatter: (value) => {
                  return value + 'k';
                },
              },
            },
            size: '80%',
          },
        },
      },
      yaxis: {
        labels: {
          formatter: (value) => {
            return 'R$' + value;
          },
        },
      },
      xaxis: {
        labels: {
          formatter: (value) => {
            return 'R$' + value;
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  };

  getNextFourMonths(): string[] {
    const months = [];
    for (let i = 0; i < 4; i++) {
      //Verificar se esse add('month') vira no ano para evitar bugs
      const nextDate = this.dataPickerService
        .currentDateSignal()
        .clone()
        .add(i, 'month')
        .format('MMM / YYYY');
      const nexDateFormat = nextDate.charAt(0).toUpperCase() + nextDate.slice(1).toLowerCase();
      months.push(nexDateFormat);
    }
    return months;
  }

  // Gera dados de saldo para os próximos meses
  lastBalances = () => {
    let lastBalances = [];

    for (let i = 0; i < 4; i++) {
      //Adicionar a variavel global par auser na função getNextFourMounths()
      const nextDates = this.dataPickerService
        .currentDateSignal()
        .clone()
        .add(i, 'month')
        .format('MM/YYYY');

      //Filtra as receitas e pega o total de todas as receitas dos ultimos meses estipulados
      const incomingsFiltered = this.incomings.filter(
        (incoming) => moment(incoming.data).format('MM/YYYY') == nextDates
      );
      const totalIncomings =
        this._transactionsService.totalTransactionAccumulator(incomingsFiltered);

      //Filtra as despesas e pega o total de todas as despesas dos ultimos meses estipulados
      const expenseFiltered = this.expenses.filter(
        (incoming) => moment(incoming.data).format('MM/YYYY') == nextDates
      );
      const totalExpenses = this._transactionsService.totalTransactionAccumulator(expenseFiltered);

      const totalBalancos = totalIncomings - totalExpenses;
      lastBalances.push(totalBalancos);
    }

    return lastBalances;
  };
}
