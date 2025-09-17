import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SheetService } from './sheet.service';
import { Transition } from '../../pages/transitions/transitions';
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
  protected transitionData: Transition = inject(DIALOG_DATA);

  private dataPickerService = inject(DataPickerService);

  protected categories: {value: string, txt: string}[] = [];

  protected isEditConfirm = false;

  protected transitionForm = new FormGroup({
    value: new FormControl(this.transitionData?.valor ?? '', Validators.required),
    date: new FormControl((this.transitionData?.data && !this.transitionData?.recorrente) ? this.transitionData?.data : this.dataPickerService.currentDateSignal().format('YYYY-MM-DD'), Validators.required),
    name: new FormControl(this.transitionData?.nome ?? '', Validators.required),
    category: new FormControl(this.transitionData?.categoria ?? '', Validators.required),
    description: new FormControl(this.transitionData?.descricao ?? ''),
    status: new FormControl(this.transitionData?.status ?? false),
    typeRef: new FormControl(this.transitionData?.tipo ?? 'despesa', Validators.required),
    repeatType: new FormControl(this.transitionData?.repeticoes ? 'REPEAT' : 'FIXA'),
    recorrente: new FormControl(this.transitionData?.recorrente ? true : false),
    repeat: new FormControl(this.transitionData?.recorrente ?? false),
    repeatTimes: new FormControl(this.transitionData?.repeticoes ?? 2),
    typeMovimentation: new FormControl(1, Validators.required),
  });

  protected isRecorrente =  false;

  ngOnInit(): void {
    this.changeCategoryByType();

    if (this.transitionData?.recorrente || this.transitionData?.repete) {
      this.isRecorrente = true;
      this.changeRepeatType()
    }

  }

  protected handleSubmit = () => {

    if (!this.transitionForm.valid) {
      console.log('invalidos', this.transitionForm.controls.value.valid);
      
      alert('Preencha todos os campos obrigatórios!')
      return
    }

    if (this.transitionData) {
      this.updateTransition();
      return
    }

    this.postTransition();
  }

  private postTransition = () => {    
    const transitionFormData = this.transitionForm.value;
    
    this.apiService.postTransition(transitionFormData, this.selectRoteRequest()).subscribe({
      next: (transition_response) => {
        this.sheetService.reloadTransitions();
        this.dialogRef.close();
      },
      error: (transition_error: HttpErrorResponse) => {
        console.log('ERROR', transition_error);
      }
    })
  }

  private updateTransition = () => {
    if (this.transitionForm.value.recorrente) {
      const rota = this.selectRoteRequest();

      const transitionFormData = {
        id: this.transitionData.id,
        date: moment(this.transitionForm.value.date).format("YYYY-MM"),
        value: this.transitionForm.value.value,
        description: this.transitionForm.value.description
      } 

      
      if (this.isEditConfirm && this.transitionForm.value.typeMovimentation === 1) {
        this.apiService.putTransitionSobrecrita(transitionFormData.id, transitionFormData, rota).subscribe({
          next: (transitionFixe_response) => {
            this.sheetService.reloadTransitions();
            this.dialogRef.close()          
          }
        })
      }
     
      if (this.isEditConfirm && this.transitionForm.value.typeMovimentation === 2) {

        this.apiService.deleteAllTransitionsSobrescritas(this.transitionData.id, this.selectRoteRequest()).subscribe({
          next: (delete_sobrescrita_response) => {
            this.apiService.putTransition(this.transitionData.id, this.transitionForm.value, this.selectRoteRequest()).subscribe({
              next: (edit_response) => {
                this.sheetService.reloadTransitions();
                this.dialogRef.close();
              }
            })
          }
        })
      }

      this.isEditConfirm = true;      
      return
    }

    this.apiService.putTransition(this.transitionData.id, this.transitionForm.value, this.selectRoteRequest()).subscribe({
      next: (edit_response) => {
        this.sheetService.reloadTransitions();
        this.dialogRef.close();
      }
    })
  }

  protected changeRecorrentePayment = (event: Event) => {
    const target = event.target as HTMLInputElement;
    this.isRecorrente = target.checked;
    this.changeRepeatType();
  }
  protected changeRepeatType = () => {
    const repeatType = this.transitionForm.value.repeatType;

    if (!this.isRecorrente) {
      this.transitionForm.controls['repeatType'].setValue(null);
      this.transitionForm.controls['repeatTimes'].setValue(null);
    }

    this.transitionForm.controls['repeat'].setValue(repeatType === 'REPEAT' && this.isRecorrente ? true : false);
    this.transitionForm.controls['recorrente'].setValue(repeatType === 'FIXA' && this.isRecorrente ? true : false);    
  }

  protected backEdit = () => {
    this.isEditConfirm = false;
  }

  protected deleteTransition = () => {
    console.log('DELETE', this.transitionData.id);

    this.apiService.deleteTransition(this.transitionData.id, this.selectRoteRequest()).subscribe({
      next: (delete_response) => {
        this.sheetService.reloadTransitions();
        this.dialogRef.close();        
      }
    })
  }

  selectRoteRequest = () => {
    const rote = this.transitionForm.value.typeRef === 'despesa' ? 'despesas' : 'receitas';

    if (this.transitionForm.value.recorrente) {
      return rote === 'despesas' ? 'despesasFixas' : 'receitasFixas';
    }
    return rote;
  }

  protected changeCategoryByType = () => {
    console.log('change', this.transitionForm.value.typeRef);
    if (this.transitionForm.value.typeRef === 'receita') {
      this.categories = [
        { value: '', txt: 'Selecione a categoria' },
        { value: 'salario', txt: 'Salário' },
        { value: 'investimento', txt: 'Investimento' },
        { value: 'outros', txt: 'Outros' },
      ];
    } else {
      this.categories = [
        { value: '', txt: 'Selecione a categoria'},
        { value: 'cartao', txt: 'Cartão' },
        { value: 'veiculo', txt: 'Veículo' },
        { value: 'compras', txt: 'Compras' },
        { value: 'pagamento', txt: 'Pagamento'},
        { value: 'alimentacao', txt: 'Alimentação' },
      ]
    }
  }

}
