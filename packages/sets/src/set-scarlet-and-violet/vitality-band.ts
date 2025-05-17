import { TrainerCard, TrainerType, StoreLike, State, Effect, PutDamageEffect, StateUtils, IS_TOOL_BLOCKED } from "@ptcg/common";

export class VitalityBand extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '197';

  public regulationMark = 'G';

  public name: string = 'Vitality Band';

  public fullName: string = 'Vitality Band SVI';

  public text: string =
    'The attacks of the Pokémon this card is attached to do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);

      if (IS_TOOL_BLOCKED(store, state, effect.player, this)) { return state; }

      if (effect.target !== player.active && effect.target !== opponent.active) {
        return state;
      }

      if (effect.damage > 0 && effect.target === opponent.active) {
        effect.damage += 10;
      }
    }
    return state;
  }
}