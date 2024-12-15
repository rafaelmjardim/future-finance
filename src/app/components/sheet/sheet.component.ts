import { animate, style, transition, trigger } from '@angular/animations';
import { DialogModule, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-sheet',
  standalone: true,
  imports: [DialogModule, NgIcon],
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.scss',
  animations: [
    trigger('sheetAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('.4s ease', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('.4s ease', style({ transform: 'translateX(100%)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class SheetComponent {
  protected dialogRef = inject(DialogRef<SheetComponent>);

}
