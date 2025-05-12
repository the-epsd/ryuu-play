import { TrainerCard, TrainerType, StoreLike, State, Effect, CheckHpEffect, IS_TOOL_BLOCKED, PutDamageEffect, StateUtils, KnockOutEffect } from '@ptcg/common';


export class ExpertBelt extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'AR';

  public name: string = 'Expert Belt';

  public fullName: string = 'Expert Belt AR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '87';

  public text: string =
    'The Pokemon this card is attached to gets +20 HP and that Pokemon\'s ' +
    'attacks do 20 more damage to your opponent\'s Active Pokemon (before ' +
    'applying Weakness and Resistance). When the Pokemon this card is ' +
    'attached to is Knocked Out, your opponent takes 1 more Prize card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckHpEffect && effect.target.cards.includes(this)) {

      if (IS_TOOL_BLOCKED(store, state, effect.player, this)) { return state; }

      effect.hp += 20;
    }

    if (effect instanceof PutDamageEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);

      if (IS_TOOL_BLOCKED(store, state, effect.player, this)) { return state; }

      if (effect.target !== player.active && effect.target !== opponent.active) {
        return state;
      }

      const attack = effect.attack;
      if (attack && attack.damage > 0 && effect.target === opponent.active) {
        effect.damage += 20;
      }
    }

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {

      if (IS_TOOL_BLOCKED(store, state, effect.player, this)) { return state; }

      effect.prizeCount += 1;
    }

    return state;
  }

}
