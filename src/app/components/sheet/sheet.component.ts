import { DialogModule, DialogRef } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-sheet',
  standalone: true,
  imports: [DialogModule, NgIcon, NgClass],
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.scss',
})
export class SheetComponent {
  protected dialogRef = inject(DialogRef<SheetComponent>);

}
