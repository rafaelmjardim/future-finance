import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable, signal } from '@angular/core';
import { SheetComponent } from './sheet.component';

@Injectable({
  providedIn: 'root'
})
export class SheetService {
  private dialog = inject(Dialog);

  public reloadTransitionsSignal = signal(false);

  public openSheetDialog = () => {
    this.dialog.open(SheetComponent);
  }
}
