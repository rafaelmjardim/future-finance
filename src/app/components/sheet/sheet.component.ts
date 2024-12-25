import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ButtonComponent } from '../button/button.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SheetService } from './sheet.service';
import { Transition } from '../../pages/transitions/transitions';

@Component({
  selector: 'app-sheet',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule, NgIcon, NgClass, ButtonComponent],
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.scss',
})
export class SheetComponent {
  protected dialogRef = inject(DialogRef<SheetComponent>);
  private apiService = inject(ApiService);
  private sheetService = inject(SheetService);
  protected transitionData: Transition = inject(DIALOG_DATA);

  protected transitionForm = new FormGroup({
    value: new FormControl(this.transitionData?.valor ?? ''),
    date: new FormControl(this.transitionData?.data ?? ''),
    name: new FormControl(this.transitionData?.nome ?? ''),
    description: new FormControl(this.transitionData?.descricao ?? ''),
    typeRef: new FormControl(this.transitionData?.tipo ?? 'despesa'),
  });

  protected handleSubmit = () => {
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
    return this.transitionForm.value.typeRef === 'despesa' ? 'despesas' : 'receitas';
  }

}
