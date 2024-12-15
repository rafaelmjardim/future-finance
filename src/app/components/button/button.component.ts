import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Output() actionEvent = new EventEmitter<void>();
  @Input() txt!: string;
  @Input() icon!: string;

  handleAction = () => {
    this.actionEvent.emit()
  }

}
