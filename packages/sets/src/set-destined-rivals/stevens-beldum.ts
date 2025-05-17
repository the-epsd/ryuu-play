import { PokemonCard, Stage, CardTag, CardType } from "@ptcg/common";

export class StevensBeldum extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags: CardTag[] = [CardTag.STEVENS];
  public cardType: CardType = M;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Metal Slash',
      cost: [M, C],
      damage: 30,
      text: ''
    }
  ];

  public regulationMark: string = 'I';
  public set: string = 'SVOD';
  public setNumber: string = '5';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Steven\'s Beldum';
  public fullName: string = 'Steven\'s Beldum SVOD';
}
