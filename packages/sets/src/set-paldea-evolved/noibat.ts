import { PokemonCard, Stage, CardType } from "@ptcg/common";

export class Noibat extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 70;

  public weakness = [ ];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Gust',
    cost: [ CardType.PSYCHIC, CardType.DARK ],
    damage: 40,
    text: ''
  }];

  public regulationMark = 'G';

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '152';

  public name: string = 'Noibat';

  public fullName: string = 'Noibat PAL';

}