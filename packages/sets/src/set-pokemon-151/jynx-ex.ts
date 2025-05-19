import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, SpecialCondition, KnockOutOpponentEffect, ADD_SLEEP_TO_PLAYER_ACTIVE } from "@ptcg/common";

export class Jynxex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = W;
  public hp: number = 200;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Heart-Stopping Kiss',
      cost: [W, C, C],
      damage: 0,
      text: 'If your opponent\'s Active Pokémon is Asleep, it is Knocked Out.'
    },
    {
      name: 'Icy Wind',
      cost: [W, W, W],
      damage: 120,
      text: 'Your opponent\'s Active Pokémon is now Asleep.'
    }
  ];

  public regulationMark = 'G';
  public set: string = 'MEW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '124';
  public name: string = 'Jynx ex';
  public fullName: string = 'Jynx ex MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Heart-Stopping Kiss
    if (WAS_ATTACK_USED(effect, 0, this)){
      const opponent = effect.opponent;

      if (opponent.active.specialConditions.includes(SpecialCondition.ASLEEP)){
        const dealDamage = new KnockOutOpponentEffect(effect, 999);
        dealDamage.target = opponent.active;
        store.reduceEffect(state, dealDamage);
      }
    } 
    
    // Icy Wind
    if (WAS_ATTACK_USED(effect, 1, this)){
      const opponent = effect.opponent;
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, opponent, this);
    }

    return state;
  }

}
