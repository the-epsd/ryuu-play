import { PokemonCard, Stage, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from "@ptcg/common";

export class Koffing extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];
  public attacks = [
    {
      name: 'Suspicious Gas',
      cost: [C, C],
      damage: 20,
      text: 'Your opponent\'s Active Pokémon is now Confused.'
    }
  ];
  public set: string = 'MEW';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '109';
  public name: string = 'Koffing';
  public fullName: string = 'Koffing MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this))
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);

    return state;
  }
}