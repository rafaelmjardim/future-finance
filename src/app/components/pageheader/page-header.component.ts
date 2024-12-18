import { Component, Input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { DataPickerComponent } from '../data-picker/data-picker.component';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [NgIcon, DataPickerComponent],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
  @Input() title!: string;
  @Input() icon!: string;

}
