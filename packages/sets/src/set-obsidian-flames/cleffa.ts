import { PokemonCard, Stage, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND } from "@ptcg/common";

export class Cleffa extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 30;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [  ];

  public attacks = [
    {
      name: 'Grasping Draw',
      cost: [  ],
      damage: 0,
      text: 'Draw cards until you have 7 cards in your hand.'
    }
  ];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '80';

  public name: string = 'Cleffa';

  public fullName: string = 'Cleffa OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND(7, effect, state);
    }

    return state;
  }
}