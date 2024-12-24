import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ButtonComponent } from '../button/button.component';
import { FormControl, FormGroup, ReactiveFormsModule, RequiredValidator } from '@angular/forms';
import { ApiService } from '../../services/api/api.service';
import { User } from '../../services/user/user';
import { UserService } from '../../services/user/user.service';
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
    const transitionData = this.transitionForm.value;
  
    this.apiService.postTransition(transitionData, transitionData.typeRef === 'despesa' ? 'despesas' : 'receitas').subscribe({
      next: (transition_response) => {
        this.sheetService.reloadTransitionsSignal.set(true);
        this.dialogRef.close();
      },
      error: (transition_error: HttpErrorResponse) => {
        console.log('ERROR', transition_error);
      }
    })
  }

  protected handleUpdateTransition = (id: string) => {
    console.log('UPDATE', id);
    
  }

  protected handleDeleteTransition = (id: string) => {
    console.log('DELETE', id);
    
  }

}
