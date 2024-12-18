import { DialogModule, DialogRef } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-sheet',
  standalone: true,
  imports: [DialogModule, NgIcon, NgClass, ButtonComponent],
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.scss',
})
export class SheetComponent {
  protected dialogRef = inject(DialogRef<SheetComponent>);

}
