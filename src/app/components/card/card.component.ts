import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CurrencyPipe, NgClass],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() title!: string;
  @Input() value!: number;
  @Input() description!: string;
  @Input() typeRef!: 'BALANCO' | 'RECEITA' | 'DESPESA';


}
