import { PokemonCard, Stage, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, DealDamageEffect } from "@ptcg/common";

export class Toxel extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Slight Intrusion',
      cost: [L],
      damage: 30,
      text: 'This Pokémon also does 10 damage to itself.'
    },
  ];

  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '71';
  public name: string = 'Toxel';
  public fullName: string = 'Toxel OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const dealDamage = new DealDamageEffect(effect, 10);
      dealDamage.target = player.active;
      store.reduceEffect(state, dealDamage);
      return state;
    }
    
    return state;
  }
}