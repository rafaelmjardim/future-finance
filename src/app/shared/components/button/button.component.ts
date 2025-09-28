import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { LoaderComponent } from '../loader/loader.component';

@Component({
    selector: 'app-button',
    imports: [NgIcon, NgClass, LoaderComponent],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Output() actionEvent = new EventEmitter<void>();
  @Input() txt!: string;
  @Input() icon!: string;
  @Input() iconType!: 'DELETE' | 'DEFAULT';
  @Input() loader = false;

  handleAction = () => {
    this.actionEvent.emit()
  }

}
