import { inject, Injectable, signal } from '@angular/core';
import { Transaction } from '../interfaces/interfaces';
import moment from 'moment';
import { DataPickerService } from '../../../shared/components/data-picker/data-picker.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private readonly _dataPickerService = inject(DataPickerService);

  //Função que retorna o valor total de uma transição (acumulador: Soma de todos os valores)
  public totalTransactionAccumulator = (transactions: Transaction[]) => {
    return transactions.reduce((acc, transaction) => {
      return acc + transaction.valor;
    }, 0);
  };

  public checkAndSetRepeatTransactions = (
    transactions: Transaction[],
    currentMonthDataPicker: any
  ) => {
    let transactionsFormatted = transactions.map((transaction) => {
      const startDate = moment(transaction.data).startOf('month');
      const currentDate = this._dataPickerService.currentDateSignal().startOf('month');

      const diffInMonths = currentDate.diff(startDate, 'month');
      const currentRepeat = diffInMonths + 1;

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
