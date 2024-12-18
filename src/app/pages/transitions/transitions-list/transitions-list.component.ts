import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { Transition } from '../transitions';

@Component({
  selector: 'app-transitions-list',
  standalone: true,
  imports: [NgIcon, NgClass],
  templateUrl: './transitions-list.component.html',
  styleUrl: './transitions-list.component.scss'
})
export class TransitionsListComponent {
  @Input() label!: string;
  @Input() typeRef!: 'EXPENSE' | 'INCOME';

  @Input() transitions!: Transition[];

}
