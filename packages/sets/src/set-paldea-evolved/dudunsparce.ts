import { PokemonCard, Stage, CardType, Attack, StoreLike, State, Effect, WAS_ATTACK_USED, YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED, SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK } from "@ptcg/common";

export class Dudunsparce extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Dunsparce';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 140;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [C, C, C];

  public attacks: Attack[] = [
    { name: 'Mud-Slap', cost: [C], damage: 30, text: '' },
    {
      name: 'Dig Away Flash',
      cost: [C, C, C, C],
      damage: 100,
      text: 'Your opponent\'s Active Pokémon is now Paralyzed. Shuffle this Pokémon and all attached cards into your deck.'
    }
  ];

  public regulationMark = 'G';

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '157';

  public name: string = 'Dudunsparce';

  public fullName: string = 'Dudunsparce PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
      SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK(store, state, effect);
    }

    return state;
  }

}
