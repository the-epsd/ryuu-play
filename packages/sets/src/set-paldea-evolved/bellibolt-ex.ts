import { PokemonCard, CardTag, Stage, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON, CONFIRMATION_PROMPT, DISCARD_X_ENERGY_FROM_THIS_POKEMON, ADD_PARALYZED_TO_PLAYER_ACTIVE } from "@ptcg/common";

export class Belliboltex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Tadbulb';
  public cardType: CardType = L;
  public hp: number = 280;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Jumping Press',
      cost: [C, C],
      damage: 0,
      text: 'This attack does 50 damage to 1 of your opponent\'s Pokémon. (Don’t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Paralyzing Bolt',
      cost: [L, L, C],
      damage: 160,
      text: 'You may discard 2 [L] Energy from this Pokémon to make your opponent\'s Active Pokémon Paralyzed.'
    }
  ];

  public set: string = 'PAL';
  public regulationMark: string = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '79';
  public name: string = 'Bellibolt ex';
  public fullName: string = 'Bellibolt ex PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Jumping Press
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(50, effect, store, state);
    }

    // Paralyzing Bolt
    if (WAS_ATTACK_USED(effect, 1, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2, L);
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    return state;
  }
}