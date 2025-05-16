import { StoreLike, State, Effect, IS_TOOL_BLOCKED, KnockOutEffect, TrainerCard, TrainerType } from '@ptcg/common';

export class LilliesPearl extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;
  public regulationMark = 'I';
  public set: string = 'JTG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '151';
  public name: string = 'Lillie\'s Pearl';
  public fullName: string = 'Lillie\'s Pearl JTG';
  public text: string = 'If the Lillie\'s Pokémon this card is attached to is Knocked Out by damage from an attack from your opponent\'s Pokémon, that player takes 1 fewer Prize card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this) && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {

      if (IS_TOOL_BLOCKED(store, state, effect.player, this)) { return state; }

      if (effect.target.isLillies()) {
        effect.prizeCount -= 1;
      }

      return state;
    }
    return state;
  }
}



