import { Request, Response } from 'express';

import { Controller, Get } from './controller';
import { Md5 } from '../../utils';
import { CardManager, CardsInfo } from '@ptcg/common';

export class Cards extends Controller {

  private cardsInfo?: CardsInfo;

  @Get('/all')
  public async onAll(req: Request, res: Response) {
    if (!this.cardsInfo) {
      this.cardsInfo = this.buildCardsInfo();
    }
    res.send({ ok: true, cardsInfo: this.cardsInfo });
  }

  @Get('/hash')
  public async onHash(req: Request, res: Response) {
    if (!this.cardsInfo) {
      this.cardsInfo = this.buildCardsInfo();
    }
    const cardsTotal = this.cardsInfo.cards.length;
    const hash = this.cardsInfo.hash;
    res.send({ ok: true, cardsTotal, hash });
  }

  private buildCardsInfo(): CardsInfo {
    const cardManager = CardManager.getInstance();
    const cards = cardManager.getAllCards();

    const cardsInfo: CardsInfo = {
      cards,
      hash: ''
    };

    const hash = Md5.init(JSON.stringify(cardsInfo));
    cardsInfo.hash = hash;
    return cardsInfo;
  }
}
