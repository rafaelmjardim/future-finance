import { MediaQueryService } from '../../../../shared/services/media-query/media-query.service';
import { Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { UtilsService } from '../../../../shared/services/utils/utils.service';
import { pagesItems } from '../../../../constants/menu';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { SheetService } from '../../components/sheet/sheet.service';
import { DataPickerService } from '../../../../shared/components/data-picker/data-picker.service';
import { NgClass } from '@angular/common';
import { TransactionApi } from '../../apis/transaction.api';
import { PageHeaderComponent } from '../../../../shared/components/pageheader/page-header.component';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';
import { filter, map, switchMap } from 'rxjs';
import { ChartOptions, Transaction } from '../../interfaces/interfaces';
import { TransactionsService } from '../../services/transactions.service';

@Component({
  selector: 'app-transactions',
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
  public readonly _transactionService = inject(TransactionsService);
  protected readonly _dataPickerService = inject(DataPickerService);
  private api = inject(TransactionApi);
  protected mediaQueryService = inject(MediaQueryService);
  protected utilsService = inject(UtilsService);
  private sheetService = inject(SheetService);

  private currentMonthDataPicker!: any;

  protected pageItem = pagesItems['transacoes'];

  protected incomings: Transaction[] = [];
  protected expenses: Transaction[] = [];

  protected incomingsFixes: Transaction[] = [];
  protected expensesFixes: Transaction[] = [];

  protected totalIncomings!: number;
  protected totalExpenses!: number;

  protected chartOptions!: Partial<ChartOptions> | any;

  constructor() {
    effect(() => {
      if (this.sheetService.reloadTransactionsSignal()) {
        this.getTransactions();
        //Verificar, talvez tenha que setar para false o reload pois não vá reconhecer segunda transação seguida (signal não atualiza mesmo valor caso n tenha mudança)
      }

      this._dataPickerService.currentDateSignal();
      this.getTransactions(); //Get duplicado, resolver depois
    });
  }

  ngOnInit(): void {
    this._transactionService.loaders.showTransaction.set(false);
    this.getTransactions();
  }

  private getTransactions = (): void => {
    this.api
      .getTransactions()
      .pipe(filter((transactions) => !!transactions))
      .subscribe({
        next: ({ receitas, despesas }) => {
          const receitasResponse = this.utilsService.convertGetFirebase(receitas);
          const despesasResponse = this.utilsService.convertGetFirebase(despesas);

          this.incomings = this._dataPickerService.filterTransactionByDate(receitasResponse);
          this.expenses = this._dataPickerService.filterTransactionByDate(despesasResponse);

          this.currentMonthDataPicker = this._dataPickerService
            .currentDateSignal()
            .format('YYYY-MM');

          this.incomings = this._transactionService.checkAndSetRepeatTransactions(
            this.incomings,
            this.currentMonthDataPicker
          );
          this.expenses = this._transactionService.checkAndSetRepeatTransactions(
            this.expenses,
            this.currentMonthDataPicker
          );

          // Seta icones conforme categoria
          this.incomings = this.setIconCategoryInTransaction(this.incomings);
          this.expenses = this.setIconCategoryInTransaction(this.expenses);

          this.totalIncomings = this._transactionService.totalTransactionAccumulator(
            this.incomings
          );
          this.totalExpenses = this._transactionService.totalTransactionAccumulator(this.expenses);

          this._transactionService.loaders.showTransaction.set(true);
          this.initChart();
        },
      });
  };

  private setIconCategoryInTransaction = (transactions: Transaction[]): Transaction[] => {
    return (transactions = transactions.map((transaction) => {
      return {
        ...transaction,
        icon:
          transaction.tipo === 'despesa'
            ? this.setIconByCetegory(transaction.categoria)
            : 'lucideDollarSign',
      };
    }));
  };

  private setIconByCetegory = (categoryKey: string): string => {
    const icons: { [ket: string]: string } = {
      cartao: 'ionCardOutline',
      veiculo: 'ionCarOutline',
      pagamento: 'ionBarcodeOutline',
      compras: 'ionPricetagOutline',
      alimentacao: 'ionFastFoodOutline',
    };

    return icons[categoryKey] ?? 'ionPricetagOutline';
  };

  private initChart = () => {
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
