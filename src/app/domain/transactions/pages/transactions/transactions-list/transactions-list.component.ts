import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { Transaction } from '../transactions';
import { ItemLoaderComponent } from './item-loader/item-loader.component';
import { UtilsService } from '../../../../../shared/services/utils/utils.service';
import { Dialog } from '@angular/cdk/dialog';
import { SheetComponent } from '../../../components/sheet/sheet.component';

@Component({
    selector: 'app-transactions-list',
    imports: [NgIcon, NgClass, CurrencyPipe, DatePipe, ItemLoaderComponent],
    templateUrl: './transactions-list.component.html',
    styleUrl: './transactions-list.component.scss'
})
export class TransactionsListComponent {
  @Input() label!: string;
  @Input() typeRef!: 'EXPENSE' | 'INCOME';
  @Input() transactions!: Transaction[];

  protected utilsService = inject(UtilsService);
  private dialog = inject(Dialog);

  protected handleEditTransaction = (transaction: Transaction) => {
    this.dialog.open(SheetComponent, {
      data: transaction,
    });
  };
}
