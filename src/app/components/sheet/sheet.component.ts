import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ButtonComponent } from '../button/button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SheetService } from './sheet.service';
import { Transition } from '../../pages/transitions/transitions';
import moment from 'moment';
import { MediaQueryService } from '../../services/media-query/media-query.service';

@Component({
  selector: 'app-sheet',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule, NgIcon, NgClass, ButtonComponent],
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.scss',
})
export class SheetComponent {
  protected dialogRef = inject(DialogRef<SheetComponent>);
  protected mediaQueryService = inject(MediaQueryService);
  private apiService = inject(ApiService);
  private sheetService = inject(SheetService);
  protected transitionData: Transition = inject(DIALOG_DATA);

  protected transitionForm = new FormGroup({
    value: new FormControl(this.transitionData?.valor ?? '', Validators.required),
    date: new FormControl(this.transitionData?.data ?? moment().format('YYYY-MM-DD'), Validators.required),
    name: new FormControl(this.transitionData?.nome ?? '', Validators.required),
    category: new FormControl(this.transitionData?.categoria ?? '', Validators.required),
    description: new FormControl(this.transitionData?.descricao ?? ''),
    typeRef: new FormControl(this.transitionData?.tipo ?? 'despesa', Validators.required),
    status: new FormControl(this.transitionData?.status ?? false),
    recorrente: new FormControl(this.transitionData?.recorrente ?? false),
  });

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

  protected updateTransition = () => {
    this.apiService.putTransition(this.transitionData.id, this.transitionForm.value, this.selectRoteRequest()).subscribe({
      next: (edit_response) => {
        this.sheetService.reloadTransitions();
        this.dialogRef.close();
      }
    })
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

}
