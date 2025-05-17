import { PokemonCard, CardTag, Stage, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, DISCARD_X_ENERGY_FROM_THIS_POKEMON } from "@ptcg/common";

export class Toxtricityex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Toxel';
  public cardType: CardType = L;
  public hp: number = 260;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Strumming Thunder',
      cost: [L, L, C],
      damage: 240,
      text: 'Discard 2 Energy from this Pokémon.'
    }
  ];

  public set: string = 'SVP';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '215';
  public name: string = 'Toxtricity ex';
  public fullName: string = 'Toxtricity ex SVP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Strumming Thunder
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
    }

    return state;
  }
}