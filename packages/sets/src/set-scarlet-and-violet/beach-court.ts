import { TrainerCard, TrainerType, StoreLike, State, Effect, CheckRetreatCostEffect, StateUtils, Stage, CardType, UseStadiumEffect, GameError, GameMessage } from "@ptcg/common";

export class BeachCourt extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;
  public regulationMark = 'G';
  public set: string = 'SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '167';
  public name: string = 'Beach Court';
  public fullName: string = 'Beach Court SVI';
  public text: string = 'The Retreat Cost of each Basic Pokémon in play (both yours and your opponent\'s) is [C] less.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckRetreatCostEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard && pokemonCard.stage == Stage.BASIC) {
        const index = effect.cost.indexOf(CardType.COLORLESS);
        if (index !== -1) {
          effect.cost.splice(index, 1);
        }
      }
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }
    return state;
  }
}