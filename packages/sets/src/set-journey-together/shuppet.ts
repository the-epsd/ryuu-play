import { CardType, PokemonCard, Stage } from '@ptcg/common';

export class Shuppet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{ name: 'Spooky Shot', 
      cost: [P], 
      damage: 20, 
      text: '' 
    }];

  public set: string = 'JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Shuppet';
  public fullName: string = 'Shuppet JTG';
}