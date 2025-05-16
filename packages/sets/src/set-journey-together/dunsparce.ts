import { StoreLike, State, Effect, CardType, PokemonCard, Stage, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '@ptcg/common';

export class Dunsparce extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Trading Places',
      cost: [C],
      damage: 0,
      text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
    },
    {
      name: 'Ram',
      cost: [C, C],
      damage: 20,
      text: ''
    },
  ];

  public set = 'JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '120';
  public name = 'Dunsparce';
  public fullName = 'Dunsparce JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this))
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
    return state;
  }
}