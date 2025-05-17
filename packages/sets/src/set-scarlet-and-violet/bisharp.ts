import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, PutDamageEffect } from "@ptcg/common";

export class Bisharp extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Pawniard';
  public cardType: CardType = D;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Dark Cutter',
    cost: [D],
    damage: 40,
    text: ''
  },
  {
    name: 'Double-Edged Slash',
    cost: [D, C],
    damage: 120,
    text: 'This Pokémon also does 30 damage to itself.'
  }];

  public set: string = 'SVI';
  public setNumber = '133';
  public cardImage = 'assets/cardback.png';
  public regulationMark: string = 'H';
  public name: string = 'Bisharp';
  public fullName: string = 'Bisharp SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const damageThatBoi = new PutDamageEffect(effect, 30);
      damageThatBoi.target = effect.player.active;
      store.reduceEffect(state, damageThatBoi);
    }
    return state;
  }
}