import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Component, inject, input, Input, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ItemLoaderComponent } from './item-loader/item-loader.component';
import { Dialog } from '@angular/cdk/dialog';
import { Transaction } from '../../interfaces/interfaces';
import { TransactionsService } from '../../services/transactions.service';
import { SheetComponent } from '../sheet/sheet.component';

@Component({
  selector: 'app-transactions-list',
  imports: [NgIcon, NgClass, CurrencyPipe, DatePipe, ItemLoaderComponent],
  templateUrl: './transactions-list.component.html',
  styleUrl: './transactions-list.component.scss',
})
export class TransactionsListComponent {
  @Input() label!: string;
  @Input() typeRef!: 'EXPENSE' | 'INCOME';
  @Input() transactions!: Transaction[];

  public showLoader = input<boolean | null>(null);

  protected _transactionsService = inject(TransactionsService);
  private dialog = inject(Dialog);

  protected handleEditTransaction = (transaction: Transaction) => {
    this.dialog.open(SheetComponent, {
      data: transaction,
    });
  };
}
