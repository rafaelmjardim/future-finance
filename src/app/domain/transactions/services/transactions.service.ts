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

      // Foi criado regras recorrentes que sao separadas da sobrescrita, elas são usadas para editar proximos meses
      // (Depois migrar repeticoes para esse formato adicionando endMonth)
      if (transaction.recorrenteRules && !transaction.sobrescrita[currentMonthDataPicker]) {
        if (this.isRulesActive(transaction.recorrenteRules, currentMonthDataPicker)) {
          transaction = { ...transaction, ...transaction.recorrenteRules };
        }
      }

      return transaction.repete ? { ...transaction, currentRepeat } : transaction;
    });

    // Remove transação deletada caso seja fixa
    transactionsFormatted = transactionsFormatted.filter(
      (transaction) => transaction?.sobrescrita?.[currentMonthDataPicker]?.deletado !== true
    );

    return (transactions = [...transactionsFormatted]);
  };

  public isRulesActive(rule: any, month: any): boolean {
    if (rule.startMonth > month) return false;
    if (rule.endMonth && rule.endMonth < month) return false;

    return true;
  }
}
