import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SheetService } from './sheet.service';
import moment from 'moment';
import { MediaQueryService } from '../../../../shared/services/media-query/media-query.service';
import { DataPickerService } from '../../../../shared/components/data-picker/data-picker.service';
import { TransactionApi } from '../../apis/transaction.api';
import { Transaction } from '../../interfaces/interfaces';

@Component({
  selector: 'app-sheet',
  imports: [DialogModule, ReactiveFormsModule, NgIcon, NgClass, ButtonComponent],
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.scss',
})
export class SheetComponent implements OnInit {
  protected dialogRef = inject(DialogRef<SheetComponent>);
  protected mediaQueryService = inject(MediaQueryService);
  private apiService = inject(TransactionApi);
  private sheetService = inject(SheetService);
  protected transactionData: Transaction = inject(DIALOG_DATA);

  private dataPickerService = inject(DataPickerService);

  protected categories: { value: string; txt: string }[] = [];

  protected isEditConfirm = false;
  protected isDeleteConfirm = false;

  protected transactionForm = new FormGroup({
    value: new FormControl(this.transactionData?.valor ?? '', Validators.required),
    date: new FormControl(
      this.transactionData?.data && !this.transactionData?.recorrente
        ? this.transactionData?.data
        : this.dataPickerService.currentDateSignal().format('YYYY-MM-DD'),
      Validators.required
    ),
    name: new FormControl(this.transactionData?.nome ?? '', Validators.required),
    category: new FormControl(this.transactionData?.categoria ?? '', Validators.required),
    description: new FormControl(this.transactionData?.descricao ?? ''),
    status: new FormControl(this.transactionData?.status ?? false),
    typeRef: new FormControl(this.transactionData?.tipo ?? 'despesa', Validators.required),
    repeatType: new FormControl(this.transactionData?.repeticoes ? 'REPEAT' : 'FIXA'),
    recorrente: new FormControl(this.transactionData?.recorrente ? true : false),
    repeat: new FormControl(this.transactionData?.recorrente ?? false),
    repeatTimes: new FormControl(this.transactionData?.repeticoes ?? 2),
    typeMovimentation: new FormControl(1, Validators.required),
  });

  protected isRecorrente = false;

  ngOnInit(): void {
    this.changeCategoryByType();

    if (this.transactionData?.recorrente || this.transactionData?.repete) {
      this.isRecorrente = true;
      this.changeRepeatType();
    }
  }

  protected handleSubmit = () => {
    if (!this.transactionForm.valid) {
      console.log('invalidos', this.transactionForm.controls.value.valid);

      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    if (this.transactionData) {
      this.updateTransaction();
      return;
    }

    this.postTransaction();
  };

  private postTransaction = () => {
    const transactionFormData = this.transactionForm.value;

    this.apiService.postTransaction(transactionFormData, this.selectRoteRequest()).subscribe({
      next: () => {
        this.sheetService.reloadTransactions();
        this.dialogRef.close();
      },
      error: (transaction_error: HttpErrorResponse) => {
        console.log('ERROR', transaction_error);
      },
    });
  };

  private updateTransaction = () => {
    if (this.transactionForm.value.recorrente) {
      const rota = this.selectRoteRequest();

      const transactionFormData = {
        ...this.transactionForm.value,
        date: moment(this.transactionForm.value.date).format('YYYY-MM'),
      };

      if (this.isEditConfirm && this.transactionForm.value.typeMovimentation === 1) {
        this.apiService
          .putTransactionSobrecrita(this.transactionData.id, transactionFormData, rota)
          .subscribe({
            next: () => {
              this.sheetService.reloadTransactions();
              this.dialogRef.close();
            },
          });
      }

      if (this.isEditConfirm && this.transactionForm.value.typeMovimentation === 2) {
        this.apiService
          .deleteAllTransactionsSobrescritas(this.transactionData.id, this.selectRoteRequest())
          .subscribe({
            next: () => {
              this.apiService
                .putTransaction(
                  this.transactionData.id,
                  this.transactionForm.value,
                  this.selectRoteRequest()
                )
                .subscribe({
                  next: () => {
                    this.sheetService.reloadTransactions();
                    this.dialogRef.close();
                  },
                });
            },
          });
      }

      this.isEditConfirm = true;
      return;
    }

    this.apiService
      .putTransaction(this.transactionData.id, this.transactionForm.value, this.selectRoteRequest())
      .subscribe({
        next: () => {
          this.sheetService.reloadTransactions();
          this.dialogRef.close();
        },
      });
  };

  protected changeRecorrentePayment = (event: Event) => {
    const target = event.target as HTMLInputElement;
    this.isRecorrente = target.checked;
    this.changeRepeatType();
  };
  protected changeRepeatType = () => {
    const repeatType = this.transactionForm.value.repeatType;

    if (!this.isRecorrente) {
      this.transactionForm.controls['repeatType'].setValue(null);
      this.transactionForm.controls['repeatTimes'].setValue(null);
    }

    this.transactionForm.controls['repeat'].setValue(
      repeatType === 'REPEAT' && this.isRecorrente ? true : false
    );
    this.transactionForm.controls['recorrente'].setValue(
      repeatType === 'FIXA' && this.isRecorrente ? true : false
    );
  };

  protected backConfirmation = () => {
    this.isEditConfirm = false;
    this.isDeleteConfirm = false;
  };

  public deleteTransaction = () => {
    if (this.isDeleteConfirm && this.setTypeMovimentation() === 1) {
      const dateRecorrent = this.dataPickerService.currentDateSignal().format('YYYY-MM');

      this.apiService
        .deleteTransactionSobrescrita(
          this.transactionData.id,
          dateRecorrent,
          this.selectRoteRequest()
        )
        .subscribe({
          next: () => {
            this.sheetService.reloadTransactions();
            this.dialogRef.close();
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
          },
        });
      return;
    }

    if (!this.isDeleteConfirm || this.setTypeMovimentation() === 2) {
      this.apiService
        .deleteTransaction(this.transactionData.id, this.selectRoteRequest())
        .subscribe({
          next: () => {
            this.sheetService.reloadTransactions();
            this.dialogRef.close();
          },
        });

      return;
    }
  };

  selectRoteRequest = () => {
    return this.transactionForm.value.typeRef === 'despesa' ? 'despesas' : 'receitas';
  };

  protected changeCategoryByType = () => {
    if (this.transactionForm.value.typeRef === 'receita') {
      this.categories = [
        { value: '', txt: 'Selecione a categoria' },
        { value: 'salario', txt: 'Salário' },
        { value: 'investimento', txt: 'Investimento' },
        { value: 'outros', txt: 'Outros' },
      ];
    } else {
      this.categories = [
        { value: '', txt: 'Selecione a categoria' },
        { value: 'cartao', txt: 'Cartão' },
        { value: 'veiculo', txt: 'Veículo' },
        { value: 'compras', txt: 'Compras' },
        { value: 'pagamento', txt: 'Pagamento' },
        { value: 'alimentacao', txt: 'Alimentação' },
      ];
    }
  };

  setTypeMovimentation = (): number => {
    const startTypeMovimentation = 1;
    return this.transactionForm.value.typeMovimentation ?? startTypeMovimentation;
  };
}
