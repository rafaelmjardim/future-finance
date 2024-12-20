import { TitleCasePipe } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { DataPickerService } from './data-picker.service';

@Component({
  selector: 'app-data-picker',
  standalone: true,
  imports: [NgIcon, TitleCasePipe],
  templateUrl: './data-picker.component.html',
  styleUrl: './data-picker.component.scss'
})
export class DataPickerComponent {
  public dataPickerService = inject(DataPickerService);

  changeMouth = (direction: 'PREV' | 'NEXT') => {
    if (direction === 'PREV') {
      this.dataPickerService.currentDateSignal.update(currentDate => currentDate.clone().subtract(1, 'month'));
    }
    
    if (direction === 'NEXT') {
      this.dataPickerService.currentDateSignal.update(currentDate => currentDate.clone().add(1, 'month'));
    }
  }
}
