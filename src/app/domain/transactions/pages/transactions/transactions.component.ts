import { MediaQueryService } from '../../../../shared/services/media-query/media-query.service';
import { Component, effect, inject, OnInit } from '@angular/core';
import { UtilsService } from '../../../../shared/services/utils/utils.service';
import { pagesItems } from '../../../../constants/menu';
import { ChartOptions, Transaction } from './transactions';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SheetService } from '../../components/sheet/sheet.service';
import { DataPickerService } from '../../../../shared/components/data-picker/data-picker.service';
import { NgClass } from '@angular/common';
import { ApiService } from '../../apis/api.service';
import { PageHeaderComponent } from '../../../../shared/components/pageheader/page-header.component';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    PageHeaderComponent,
    TransactionsListComponent,
    CardComponent,
    NgApexchartsModule,
    NgClass,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  private api = inject(ApiService);
  protected mediaQueryService = inject(MediaQueryService);
  protected utilsService = inject(UtilsService);
  private sheetService = inject(SheetService);
  protected dataPickerService = inject(DataPickerService);

  private currentMonthDataPicker!: any;

  protected pageItem = pagesItems['transacoes'];

  protected incomings: Transaction[] = [];
  protected expenses: Transaction[] = [];

  protected incomingsFixes: Transaction[] = [];
  protected expensesFixes: Transaction[] = [];

  protected totalIncomings!: number;
  protected totalExpenses!: number;

  protected chartOptions!: Partial<ChartOptions>;

  constructor() {
    effect(() => {
      if (this.sheetService.reloadTransactionsSignal()) {
        this.getTransactions();
        //Verificar, talvez tenha que setar para false o reload pois não vá reconhecer segunda transação seguida (signal não atualiza mesmo valor caso n tenha mudança)
      }

      this.dataPickerService.currentDateSignal();
      this.getTransactions(); //Get duplicado, resolver depois
    });
  }

  ngOnInit(): void {
    this.utilsService.loaders.showTransaction.set(false);
    this.getTransactions();
  }

  getTransactions = () => {
    this.api.getTransactions().subscribe({
      next: ({ receitas, despesas }) => {
        const receitasResponse = this.utilsService.convertGetFirebase(receitas);
        const despesasResponse = this.utilsService.convertGetFirebase(despesas);

        this.incomings = this.utilsService.filterTransictionByDate(receitasResponse);
        this.expenses = this.utilsService.filterTransictionByDate(despesasResponse);

        this.currentMonthDataPicker = this.dataPickerService.currentDateSignal().format('YYYY-MM');

        this.incomings = this.utilsService.checkAndSetRepeatTransactions(
          this.incomings,
          this.currentMonthDataPicker
        );
        this.expenses = this.utilsService.checkAndSetRepeatTransactions(
          this.expenses,
          this.currentMonthDataPicker
        );

        // Seta icones conforme categoria
        this.incomings = this.setIconCategoryInTransiction(this.incomings);
        this.expenses = this.setIconCategoryInTransiction(this.expenses);

        this.totalIncomings = this.utilsService.totalTransictionAccumulator(this.incomings);
        this.totalExpenses = this.utilsService.totalTransictionAccumulator(this.expenses);

        this.utilsService.loaders.showTransaction.set(true);
        this.initChart();
      },
    });
  };

  setIconCategoryInTransiction = (transactions: Transaction[]) => {
    const transactionsFormatted = transactions.map((transaction) => {
      return {
        ...transaction,
        icon:
          transaction.tipo === 'despesa'
            ? this.setIconByCetegory(transaction.categoria)
            : 'lucideDollarSign',
      };
    });

    return transactionsFormatted;
  };

  setIconByCetegory = (categoryKey: string) => {
    const icons: { [ket: string]: string } = {
      cartao: 'ionCardOutline',
      veiculo: 'ionCarOutline',
      pagamento: 'ionBarcodeOutline',
      compras: 'ionPricetagOutline',
      alimentacao: 'ionFastFoodOutline',
    };

    return icons[categoryKey] ?? 'ionPricetagOutline';
  };

  initChart = () => {
    this.chartOptions = {
      series: [
        {
          name: 'Receita',
          data: [this.totalIncomings],
          // color: "#09BC8A"
          color: '#34d399',
        },
        {
          name: 'Despesa',
          data: [this.totalExpenses],
          // color: "#D33535"
          color: '#dc2626',
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
      },
      xaxis: {
        categories: ['Janeiro'],
        // title: {
        //   text: 'Meses',
        // },
      },
      yaxis: {
        // title: {
        //   text: 'Valores (R$)',
        // },
      },
    };
  };
}
