import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable, signal } from '@angular/core';
import { SheetComponent } from './sheet.component';

@Injectable({
  providedIn: 'root',
})
export class SheetService {
  private dialog = inject(Dialog);

  public reloadTransictionsSignal = signal(false);

  public reloadTransictions = () => {
    this.reloadTransictionsSignal.set(true);
    this.reloadTransictionsSignal.update((value) => !value);
  };

  public openSheetDialog = () => {
    this.dialog.open(SheetComponent);
  };
}
