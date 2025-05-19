import { PokemonCard, Stage, CardType } from "@ptcg/common";

export class Abra extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 50;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Psyshot',
      cost: [CardType.PSYCHIC],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'MEW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';
  public name: string = 'Abra';
  public fullName: string = 'Abra MEW';
}