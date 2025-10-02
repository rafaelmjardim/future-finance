import { Injectable, signal } from '@angular/core';
import moment, { Moment } from 'moment';
import { Transaction } from '../../../domain/transactions/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class DataPickerService {
  public currentDateSignal = signal(moment());

  public filterTransactionByDate = (transactions: Transaction[]) => {
    return transactions.filter((transaction) => {
      const transactionDate = moment(transaction.data).format('MM/YYYY');
      const transitioYear = moment(transaction.data).format('YYYY');
      const currentMonthDataPicker = this.currentDateSignal().format('MM/YYYY');
      const currentYearDataPicker = this.currentDateSignal().format('YYYY');

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
}
