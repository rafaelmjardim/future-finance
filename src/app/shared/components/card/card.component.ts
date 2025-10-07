import { MediaQueryService } from '../../services/media-query/media-query.service';
import { CurrencyPipe, NgClass, NgStyle } from '@angular/common';
import { Component, inject, input, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [CurrencyPipe, NgClass, NgStyle],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() title!: string;
  @Input() value!: number;
  @Input() description!: string;
  @Input() typeRef!: 'BALANCO' | 'RECEITA' | 'DESPESA';

  public showLoader = input(false);

  protected mediaQueryService = inject(MediaQueryService);
}
