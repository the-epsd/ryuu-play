import { PokemonCard, Stage, CardType } from "@ptcg/common";

export class Frigibax extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 60;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Tackle',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '57';

  public name: string = 'Frigibax';

  public fullName: string = 'Frigibax PAL1';

}
