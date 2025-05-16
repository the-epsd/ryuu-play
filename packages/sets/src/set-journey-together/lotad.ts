import { Attack, CardType, PokemonCard, Stage, Weakness } from '@ptcg/common';

export class Lotad extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness: Weakness[] = [{ type: L }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    { name: 'Water Gun', 
      cost: [W], 
      damage: 20, 
      text: '' 
    },
  ];

  public set: string = 'JTG';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';
  public name: string = 'Lotad';
  public fullName: string = 'Lotad JTG';
}