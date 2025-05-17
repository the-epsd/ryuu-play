import { TrainerCard, TrainerType, StoreLike, State, Effect, PutDamageEffect, StateUtils, Stage, UseStadiumEffect, GameError, GameMessage } from "@ptcg/common";

export class PracticeStudio extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public regulationMark = 'G';

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '186';

  public name: string = 'Practice Studio';

  public fullName: string = 'Practice Studio PAL';

  public text: string =
    'The attacks of Stage 1 Pokémon (both yours and your opponent\'s) do 10 more damage to the opponent\'s Active Pokémon (before applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && StateUtils.getStadiumCard(state) === this) {
      const pokemonCard = effect.source.getPokemonCard();
      const opponent = StateUtils.getOpponent(state, effect.player);

      const attack = effect.attack;
      if (attack && attack.damage > 0 && effect.target === opponent.active && pokemonCard && pokemonCard.stage === Stage.STAGE_1) {
        effect.damage += 10;
      }
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }
}
