import { Injectable, signal } from '@angular/core';
import moment, { Moment } from 'moment';
import { Transaction } from '../../../domain/transactions/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class DataPickerService {
  public currentDateSignal = signal(moment());

  public filterTransactionByDate = (transactions: Transaction[]) => {
    const currentDate = this.currentDateSignal(); // moment()
    const currentMonth = currentDate.startOf('month');

    return transactions.filter((transaction) => {
      const startDate = moment(transaction.data).startOf('month');

      if (transaction.repete) {
        const endDate = moment(transaction.data)
          .add(transaction.repeticoes - 1, 'month')
          .endOf('month');

        // Verifica se o mês atual está dentro do intervalo [início, fim]
        return currentMonth.isBetween(startDate, endDate, 'month', '[]');
      }

      if (transaction.recorrente) {
        return currentMonth.isSameOrAfter(startDate, 'month');
      }

      return currentMonth.isSame(startDate, 'month');
    });
  };
}
