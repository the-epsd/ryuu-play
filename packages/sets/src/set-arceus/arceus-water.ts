import { PokemonCard, Stage, CardType, CardTag, PowerType, StoreLike, State, Effect, WAS_ATTACK_USED, ApplyWeaknessEffect, AfterDamageEffect } from '@ptcg/common';

export class ArceusWater extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public retreat = [C, C];
  public tags = [CardTag.ARCEUS];

  public powers = [{
    name: 'Arceus Rule',
    powerType: PowerType.ARCEUS_RULE,
    text: 'You may have as many of this card in your deck as you like.'
  }];

  public attacks = [
    {
      name: 'Fastwave',
      cost: [W, C, C],
      damage: 50,
      shredAttack: true,
      text: 'This attack\'s damage isn\'t affected by Resistance, Poké-Powers, Poké-Bodies, or any other effects on the Defending Pokémon.'
    }
  ];

  public set: string = 'AR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'AR4';
  public name: string = 'Arceus';
  public fullName: string = 'Arceus Water AR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Fastwave
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;

      effect.ignoreResistance = true;
      const applyWeakness = new ApplyWeaknessEffect(effect, 50);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;

      effect.damage = 0;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }

    return state;
  }
}