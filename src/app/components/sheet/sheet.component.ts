import { DialogModule } from '@angular/cdk/dialog';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sheet',
  standalone: true,
  imports: [DialogModule],
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.scss'
})
export class SheetComponent {

}
