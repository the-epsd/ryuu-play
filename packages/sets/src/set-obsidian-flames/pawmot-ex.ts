import { PokemonCard, Stage, CardType, CardTag, Weakness, Attack, StoreLike, State, Effect, WAS_ATTACK_USED, DISCARD_X_ENERGY_FROM_THIS_POKEMON, THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from "@ptcg/common";

export class Pawmotex extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Pawmo';
  public cardType: CardType = L;
  public tags: string[] = [CardTag.POKEMON_ex];
  public hp: number = 300;
  public weakness: Weakness[] = [{ type: F }];
  public retreat: CardType[] = [];

  public attacks: Attack[] = [
    { name: 'Zap Kick', cost: [L], damage: 60, text: '' },
    {
      name: 'Levin Strike',
      cost: [L, L],
      damage: 0,
      text: 'Discard 2 [L] Energy from this Pokémon. This attack does 220 damage to 1 of your opponent\'s Pokémon. ' +
        '(Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
  ];

  public set: string = 'OBF';
  public regulationMark: string = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '73';
  public name: string = 'Pawmot ex';
  public fullName: string = 'Pawmot ex OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2, L);
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(220, effect, store, state);
    }

    return state;
  }
}