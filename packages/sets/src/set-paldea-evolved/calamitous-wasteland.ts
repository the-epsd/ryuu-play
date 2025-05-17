import { TrainerCard, TrainerType, StoreLike, State, Effect, CheckRetreatCostEffect, StateUtils, Stage, CheckPokemonTypeEffect, CardType, UseStadiumEffect, GameError, GameMessage } from "@ptcg/common";

export class CalamitousWasteland extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;
  public set: string = 'PAL';
  public regulationMark: string = 'G';
  public name: string = 'Calamitous Wasteland';
  public fullName: string = 'Calamitous Wasteland PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '175';

  public text: string =
    'The Retreat Cost of each Basic non-[F] Pokémon in play (both yours and your opponent\'s) is [C] more.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckRetreatCostEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;

      if (player.active.isStage(Stage.BASIC)) {

        const checkPokemonTypeEffect = new CheckPokemonTypeEffect(player.active);
        store.reduceEffect(state, checkPokemonTypeEffect);

        if (!checkPokemonTypeEffect.cardTypes.includes(CardType.FIGHTING)) {
          effect.cost.push(CardType.COLORLESS);
        }
      }
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }

}
