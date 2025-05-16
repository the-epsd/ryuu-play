import { Attack, CardType, PokemonCard, Resistance, Stage, Weakness } from '@ptcg/common';

export class Beldum extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness: Weakness[] = [{ type: D }];
  public resistance: Resistance[] = [{ type: F, value: -30 }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    {
      name: 'Spinning Attack',
      cost: [P],
      damage: 10,
      text: ''
    },
    {
      name: 'Beam',
      cost: [P, P],
      damage: 30,
      text: ''
    },
  ];

  public set: string = 'JTG';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '61';
  public name: string = 'Beldum';
  public fullName: string = 'Beldum JTG';
}