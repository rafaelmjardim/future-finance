import { inject, Injectable, signal } from '@angular/core';
import moment from 'moment';
import { DataPickerService } from '../../components/data-picker/data-picker.service';
import { Transaction } from '../../../domain/transactions/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private dataPickerService = inject(DataPickerService);

  darkModeSignal = signal(false);

  public loaders = {
    showTransaction: signal(false),
  };

  constructor() {}

  //Função que converte objetos do get em array de objetos.
  public convertGetFirebase = (objects: any) => {
    if (!objects) return [];
    return Object.keys(objects).map((key) => {
      return {
        ...objects[key],
        id: key,
      };
    });
  };

  //Função que retorna o valor total de uma transição (acumulador: Soma de todos os valores)
  public totalTransactionAccumulator = (transactions: Transaction[]) => {
    return transactions.reduce((acc, transaction) => {
      return acc + transaction.valor;
    }, 0);
  };

  public filterTransactionByDate = (transactions: Transaction[]) => {
    return transactions.filter((transaction) => {
      const transactionDate = moment(transaction.data).format('MM/YYYY');
      const transitioYear = moment(transaction.data).format('YYYY');
      const currentMonthDataPicker = this.dataPickerService.currentDateSignal().format('MM/YYYY');
      const currentYearDataPicker = this.dataPickerService.currentDateSignal().format('YYYY');

      if (transaction.repete) {
        const endDate = moment(transaction.data)
          .add(transaction.repeticoes - 1, 'month')
          .format('MM/YYYY');
        return (
          transactionDate <= currentMonthDataPicker &&
          currentMonthDataPicker <= endDate &&
          transitioYear === currentYearDataPicker
        );
      }

      if (transaction.recorrente) {
        return transactionDate <= currentMonthDataPicker && transitioYear === currentYearDataPicker;
      }
      return transactionDate == currentMonthDataPicker;
    });
  };

  public checkAndSetRepeatTransactions = (
    transactions: Transaction[],
    currentMonthDataPicker: any
  ) => {
    let transactionsFormatted = transactions.map((transaction) => {
      const initMonth = moment(transaction.data).month();
      const currentMonth = this.dataPickerService.currentDateSignal().month();
      const currentRepeat = currentMonth - initMonth + 1;

      if (transaction.sobrescrita) {
        transaction = { ...transaction, ...transaction.sobrescrita[currentMonthDataPicker] };
      }

      return transaction.repete ? { ...transaction, currentRepeat } : transaction;
    });

    // Remove transação deletada caso seja fixa
    transactionsFormatted = transactionsFormatted.filter(
      (transaction) => transaction?.sobrescrita?.[currentMonthDataPicker]?.deletado !== true
    );

    return (transactions = [...transactionsFormatted]);
  };
}
