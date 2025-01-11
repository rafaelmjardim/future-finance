import { MediaQueryService } from './../../services/media-query/media-query.service';
import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { DataPickerService } from './data-picker.service';

@Component({
  selector: 'app-data-picker',
  standalone: true,
  imports: [NgIcon, NgClass, TitleCasePipe],
  templateUrl: './data-picker.component.html',
  styleUrl: './data-picker.component.scss'
})
export class DataPickerComponent {
  public dataPickerService = inject(DataPickerService);
  protected mediaQueryService = inject(MediaQueryService);

  changeMouth = (direction: 'PREV' | 'NEXT') => {
    if (direction === 'PREV') {
      this.dataPickerService.currentDateSignal.update(currentDate => currentDate.clone().subtract(1, 'month'));
    }
    
    if (direction === 'NEXT') {
      this.dataPickerService.currentDateSignal.update(currentDate => currentDate.clone().add(1, 'month'));
    }
  }
}
