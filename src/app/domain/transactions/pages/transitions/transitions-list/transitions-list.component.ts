import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { Transition } from '../transitions';
import { ItemLoaderComponent } from './item-loader/item-loader.component';
import { UtilsService } from '../../../../../shared/services/utils/utils.service';
import { Dialog } from '@angular/cdk/dialog';
import { SheetComponent } from '../../../components/sheet/sheet.component';

@Component({
  selector: 'app-transitions-list',
  standalone: true,
  imports: [NgIcon, NgClass, CurrencyPipe, DatePipe, ItemLoaderComponent],
  templateUrl: './transitions-list.component.html',
  styleUrl: './transitions-list.component.scss'
})
export class TransitionsListComponent {
  @Input() label!: string;
  @Input() typeRef!: 'EXPENSE' | 'INCOME';
  @Input() transitions!: Transition[];

  protected utilsService = inject(UtilsService);
  private dialog = inject(Dialog);

  protected handleEditTransition = (transition: Transition) => {
    this.dialog.open(SheetComponent, {
      data: transition
    })
  }

}
