import { Response } from './response.interface';
import { Card, CardsInfo, Format } from '@ptcg/common';

export interface CardsResponse extends Response {
  cards: Card[];
  cardsInfo: CardsInfo;
}

export interface CardsHashResponse extends Response {
  cardsTotal: number;
  hash: string;
}
