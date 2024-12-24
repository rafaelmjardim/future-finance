import { DialogModule, DialogRef } from '@angular/cdk/dialog';
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

  protected transitionForm = new FormGroup({
    value: new FormControl(''),
    date: new FormControl(''),
    name: new FormControl(''),
    description: new FormControl(''),
    typeRef: new FormControl('despesas'),
  });

  handleSubmit = () => {
    const transitionData = this.transitionForm.value;
  
    this.apiService.postTransition(transitionData).subscribe({
      next: (transition_response) => {
        this.sheetService.reloadTransitionsSignal.set(true);
        this.dialogRef.close();
      },
      error: (transition_error: HttpErrorResponse) => {
        console.log('ERROR', transition_error);
      }
    })
  }

}
