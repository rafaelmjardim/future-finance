import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SheetService } from './sheet.service';
import { Transaction } from '../../pages/transactions/transactions';
import moment from 'moment';
import { MediaQueryService } from '../../../../shared/services/media-query/media-query.service';
import { DataPickerService } from '../../../../shared/components/data-picker/data-picker.service';
import { ApiService } from '../../apis/api.service';

@Component({
  selector: 'app-sheet',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule, NgIcon, NgClass, ButtonComponent],
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.scss',
})
export class SheetComponent implements OnInit {
  protected dialogRef = inject(DialogRef<SheetComponent>);
  protected mediaQueryService = inject(MediaQueryService);
  private apiService = inject(ApiService);
  private sheetService = inject(SheetService);
  protected transactionData: Transaction = inject(DIALOG_DATA);

  private dataPickerService = inject(DataPickerService);

  protected categories: { value: string; txt: string }[] = [];

  protected isEditConfirm = false;

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
      this.updateTransiction();
      return;
    }

    this.postTransiction();
  };

  private postTransiction = () => {
    const transactionFormData = this.transactionForm.value;

    this.apiService.postTransiction(transactionFormData, this.selectRoteRequest()).subscribe({
      next: (transaction_response) => {
        this.sheetService.reloadTransictions();
        this.dialogRef.close();
      },
      error: (transaction_error: HttpErrorResponse) => {
        console.log('ERROR', transaction_error);
      },
    });
  };

  private updateTransiction = () => {
    if (this.transactionForm.value.recorrente) {
      const rota = this.selectRoteRequest();

      const transactionFormData = {
        id: this.transactionData.id,
        date: moment(this.transactionForm.value.date).format('YYYY-MM'),
        value: this.transactionForm.value.value,
        description: this.transactionForm.value.description,
      };

      if (this.isEditConfirm && this.transactionForm.value.typeMovimentation === 1) {
        this.apiService
          .putTransictionSobrecrita(transactionFormData.id, transactionFormData, rota)
          .subscribe({
            next: (transactionFixe_response) => {
              this.sheetService.reloadTransictions();
              this.dialogRef.close();
            },
          });
      }

      if (this.isEditConfirm && this.transactionForm.value.typeMovimentation === 2) {
        this.apiService
          .deleteAllTransictionsSobrescritas(this.transactionData.id, this.selectRoteRequest())
          .subscribe({
            next: (delete_sobrescrita_response) => {
              this.apiService
                .putTransiction(
                  this.transactionData.id,
                  this.transactionForm.value,
                  this.selectRoteRequest()
                )
                .subscribe({
                  next: (edit_response) => {
                    this.sheetService.reloadTransictions();
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
      .putTransiction(this.transactionData.id, this.transactionForm.value, this.selectRoteRequest())
      .subscribe({
        next: (edit_response) => {
          this.sheetService.reloadTransictions();
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
    
    if (this.isRecorrente) {
      this.transactionForm.controls['repeatType'].setValue('FIXA');
      this.transactionForm.controls['repeatTimes'].setValue(2);
    }

    this.transactionForm.controls['repeat'].setValue(
      repeatType === 'REPEAT' && this.isRecorrente ? true : false
    );
    this.transactionForm.controls['recorrente'].setValue(
      repeatType === 'FIXA' && this.isRecorrente ? true : false
    );
  };

  protected backEdit = () => {
    this.isEditConfirm = false;
  };

  protected deleteTransaction = () => {
    console.log('DELETE', this.transactionData.id);

    this.apiService.deleteTransiction(this.transactionData.id, this.selectRoteRequest()).subscribe({
      next: (delete_response) => {
        this.sheetService.reloadTransictions();
        this.dialogRef.close();
      },
    });
  };

  selectRoteRequest = () => {
    const rote = this.transactionForm.value.typeRef === 'despesa' ? 'despesas' : 'receitas';

    if (this.transactionForm.value.recorrente) {
      return rote === 'despesas' ? 'despesasFixas' : 'receitasFixas';
    }
    return rote;
  };

  protected changeCategoryByType = () => {
    console.log('change', this.transactionForm.value.typeRef);
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
}
