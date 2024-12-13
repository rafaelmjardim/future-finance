import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';
import { SheetComponent } from './sheet.component';

@Injectable({
  providedIn: 'root'
})
export class SheetService {
  private dialog = inject(Dialog);

  public openSheetDialog = () => {
    this.dialog.open(SheetComponent);
  }
}
