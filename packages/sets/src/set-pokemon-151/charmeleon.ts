import { PokemonCard, Stage, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, DISCARD_X_ENERGY_FROM_THIS_POKEMON } from "@ptcg/common";

export class Charmeleon extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Charmander';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 100;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Combustion',
      cost: [CardType.FIRE],
      damage: 20,
      text: '',
    },
    {
      name: 'Fire Blast',
      cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE],
      damage: 70,
      text: 'Discard an Energy from this Pokémon.',
    }
  ];

  public set: string = 'MEW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '5';

  public name: string = 'Charmeleon';

  public fullName: string = 'Charmeleon MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }
    return state;
  }

}