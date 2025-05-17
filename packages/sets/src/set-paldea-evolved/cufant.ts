import { PokemonCard, Stage, CardType, Resistance } from "@ptcg/common";

export class Cufant extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 100;

  public weakness = [{ type: CardType.FIRE }];

  public resistance: Resistance[] = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Stampede',
      cost: [CardType.METAL, CardType.COLORLESS],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '149';

  public name: string = 'Cufant';

  public fullName: string = 'Cufant PAL';

}
