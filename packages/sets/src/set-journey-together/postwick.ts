import { StoreLike, State, Effect, CardTag, DealDamageEffect, GameError, GameMessage, StateUtils, TrainerCard, TrainerType, UseStadiumEffect } from '@ptcg/common';

export class Postwick extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;
  public set: string = 'JTG';
  public name: string = 'Postwick';
  public fullName: string = 'Postwick JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber = '154';
  public text: string = 'The attacks of Hop\'s Pokémon (both yours and your opponent\'s) do 30 more damage to the opponent\'s Active Pokémon (before applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // checking if this is targeting the active
      if (effect.target !== opponent.active) {
        return state;
      }

      // 'not a hopper' border checkpoint
      if (!effect.source.getPokemonCard()?.tags.includes(CardTag.HOPS)) {
        return state;
      }

      effect.damage += 30;
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }
}