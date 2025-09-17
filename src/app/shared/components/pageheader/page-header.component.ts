import { Component, inject, Input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { DataPickerComponent } from '../data-picker/data-picker.component';
import { NgClass, NgStyle } from '@angular/common';
import { MediaQueryService } from '../../services/media-query/media-query.service';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [NgIcon, DataPickerComponent, NgClass, NgStyle],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
  protected mediaQueryService = inject(MediaQueryService);

  @Input() title!: string;
  @Input() icon!: string;

}
