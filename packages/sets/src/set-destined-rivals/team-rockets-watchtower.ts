import { TrainerCard, TrainerType, StoreLike, State, Effect, PowerEffect, StateUtils, CardType, PowerType, GameError, GameMessage, UseStadiumEffect } from "@ptcg/common";

export class TeamRocketsWatchtower extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;
  public set: string = 'SV10';
  public regulationMark = 'I';
  public name: string = 'Team Rocket\'s Watchtower';
  public fullName: string = 'Team Rocket\'s Watchtower SV10';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';

  public text: string =
    'Both players\' [C] Pokemon have no Abilities.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && StateUtils.getStadiumCard(state) === this) {
      const pokemonCard = effect.card;

      if (pokemonCard.cardType === CardType.COLORLESS && !effect.power.exemptFromAbilityLock){
        if (pokemonCard.powers.some(power => power.powerType === PowerType.ABILITY)) {
          throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
        }

        return state;
      }
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }

}
