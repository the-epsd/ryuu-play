import { StoreLike, State, Effect, HealEffect, SpecialCondition, TrainerCard, TrainerEffect, TrainerType } from '@ptcg/common';

export class SpicySeasonedCurry extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '151';

  public regulationMark = 'E';

  public name: string = 'Spicy Seasoned Curry';

  public fullName: string = 'Spicy Seasoned Curry ASR';

  public text: string = 
    'Your Active Pokémon is now Burned. Heal 40 damage from it.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const playerActive = player.active;

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      playerActive.specialConditions.push(SpecialCondition.BURNED);
      store.reduceEffect(state, new HealEffect(player, playerActive, 40));
      player.supporter.moveCardTo(this, player.discard);
    }
    return state;
  }
}