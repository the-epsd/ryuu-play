import { PokemonCard, CardTag, Stage, CardType, StoreLike, State, Effect, AttackEffect, StateUtils, ApplyWeaknessEffect, AfterDamageEffect } from "@ptcg/common";

export class Tinkatonex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Tinkatuff';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 300;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Big Hammer',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: 'This attack does 30 damage for each card in your hand.'
    },

    {
      name: 'Pulverizing Press',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
      damage: 140,
      shredAttack: true,
      text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
    }
  ];

  public set: string = 'SVP';

  public name: string = 'Tinkaton ex';

  public fullName: string = 'Tinkaton ex SVP';

  public regulationMark: string = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '31';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Big Hammer
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      effect.damage = player.hand.cards.length * 30;
    }

    // Pulverizing Press
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const applyWeakness = new ApplyWeaknessEffect(effect, 140);
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