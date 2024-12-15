import { Component, Input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-pageheader',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './pageheader.component.html',
  styleUrl: './pageheader.component.scss'
})
export class PageheaderComponent {
  @Input() title!: string;
  @Input() icon!: string;

}
