import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, StateUtils, DealDamageEffect } from "@ptcg/common";

export class Annihilape extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType = F;
  public hp: number = 140;
  public weakness = [{ type: P }];
  public retreat = [C, C];
  public evolvesFrom = 'Primeape';

  public attacks = [{
    name: 'Rage Fist',
    cost: [F],
    damage: 70,
    damageCalculation: 'x',
    text: 'This attack does 70 damage for each Prize card your opponent has taken.'
  },
  {
    name: 'Dynamite Punch',
    cost: [F, F],
    damage: 170,
    text: 'This Pokemon also does 10 damage to itself.'
  }];

  public regulationMark: string = 'G';
  public set: string = 'SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '109';
  public name: string = 'Annihilape';
  public fullName: string = 'Annihilape SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const damagePerPrize = 70;

      effect.damage = opponent.prizesTaken * damagePerPrize;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 50);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }
    return state;
  }
}