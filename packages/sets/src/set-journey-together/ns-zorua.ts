import { CardTag, CardType, PokemonCard, Stage } from '@ptcg/common';

export class NsZorua extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.NS];
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Scratch',
    cost: [D],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'JTG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '97';
  public name: string = 'N\'s Zorua';
  public fullName: string = 'N\'s Zorua JTG';
}