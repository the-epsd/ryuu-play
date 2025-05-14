import { StoreLike, State, Effect, AttackEffect, CardType, PokemonCard, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, Stage } from '@ptcg/common';


export class HisuianBasculin extends PokemonCard {

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 50;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Gather the Crew',
      cost: [],
      damage: 0,
      text: 'Search your deck for up to 2 Basic Pokémon and put them onto your Bench. Then, shuffle your deck.'
    },
    {
      name: 'Tackle',
      cost: [CardType.WATER],
      damage: 10,
      text: ''
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(
        store, state, effect.player, { stage: Stage.BASIC }, { min: 0, max: 2 }
      );
    }

    return state;
  }

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '43';

  public name: string = 'Hisuian Basculin';

  public fullName: string = 'Hisuian Basculin ASR';
}