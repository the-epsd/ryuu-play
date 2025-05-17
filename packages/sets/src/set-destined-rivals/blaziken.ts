import { PokemonCard, Stage, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, DISCARD_X_ENERGY_FROM_THIS_POKEMON, THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from "@ptcg/common";

export class Blaziken extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Combusken';
  public cardType: CardType = R;
  public hp: number = 170;
  public weakness = [{ type: W }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Heat Blast',
      cost: [ C, C ],
      damage: 70,
      text: ''
    },
    {
      name: 'Inferno Legs',
      cost: [ R, R, C ],
      damage: 120,
      text: 'Discard 2 Energy from this Pokémon, and this attack also does 120 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
  ];

  public set: string = 'SV10';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Blaziken';
  public fullName: string = 'Blaziken SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)){
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(120, effect, store, state);
    }
    
    return state;
  }
}
