import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgIcon, NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Output() actionEvent = new EventEmitter<void>();
  @Input() txt!: string;
  @Input() icon!: string;
  @Input() iconType!: 'DELETE' | 'DEFAULT';

  handleAction = () => {
    this.actionEvent.emit()
  }

}
