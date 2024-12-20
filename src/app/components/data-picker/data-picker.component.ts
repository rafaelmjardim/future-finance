import { TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { DataPickerService } from './data-picker.service';

@Component({
  selector: 'app-data-picker',
  standalone: true,
  imports: [NgIcon, TitleCasePipe],
  templateUrl: './data-picker.component.html',
  styleUrl: './data-picker.component.scss'
})
export class DataPickerComponent implements OnInit{
  public dataPickerService = inject(DataPickerService);

  ngOnInit(): void {
    this.checkDate();
  }

  changeMouth = (direction: 'PREV' | 'NEXT') => {
    if (direction === 'PREV') {
      this.dataPickerService.currentDateSignal.update(currentDate => currentDate.subtract(1, 'month'));
    }
    
    if (direction === 'NEXT') {
      this.dataPickerService.currentDateSignal.update(currentDate => currentDate.add(1, 'month'));
    }

    this.checkDate();
  }

  checkDate = () => {
    console.log('currentDate', this.dataPickerService.currentDateSignal());
  }
}
