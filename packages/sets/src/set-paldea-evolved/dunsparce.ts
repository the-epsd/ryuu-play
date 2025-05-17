import { PokemonCard, Stage, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND } from "@ptcg/common";

export class Dunsparce extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Find a Friend',
      cost: [C],
      damage: 0,
      text: 'Search your deck for a Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.'
    },
    { name: 'Bite', cost: [C, C, C], damage: 50, text: '' },
  ];

  public set = 'PAL';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '156';
  public name = 'Dunsparce';
  public fullName = 'Dunsparce PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this))
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, effect.player, {}, { min: 0, max: 1 });
    return state;
  }
}