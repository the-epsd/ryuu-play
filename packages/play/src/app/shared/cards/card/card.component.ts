import { Component, Input } from '@angular/core';
import { Card } from '@ptcg/common';

import { CardsBaseService } from '../cards-base.service';

@Component({
  selector: 'ptcg-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  exportAs: 'ptcgCard'
})
export class CardComponent {

  public scanUrl: string;
  public data: Card;

  @Input() cardback = false;
  @Input() placeholder = false;

  @Input() set customImageUrl(value: string) {
    if (value && this.data) {
      this.scanUrl = value;
    }
  }

  @Input() set card(value: Card) {
    this.data = value;
    this.scanUrl = this.customImageUrl || this.cardsBaseService.getScanUrl(this.data);
  }

  constructor(
    private cardsBaseService: CardsBaseService,
  ) { }

}
