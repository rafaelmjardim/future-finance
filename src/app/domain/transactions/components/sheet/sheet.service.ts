import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable, signal } from '@angular/core';
import { SheetComponent } from './sheet.component';

@Injectable({
  providedIn: 'root',
})
export class SheetService {
  private dialog = inject(Dialog);

  public reloadTransactionsSignal = signal(false);

  public reloadTransactions = () => {
    this.reloadTransactionsSignal.set(true);
    this.reloadTransactionsSignal.update((value) => !value);
  };

  public openSheetDialog = () => {
    this.dialog.open(SheetComponent);
  };
}
