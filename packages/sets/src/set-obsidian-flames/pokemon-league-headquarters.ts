import { TrainerCard, TrainerType, StoreLike, State, Effect, CheckAttackCostEffect, StateUtils, Stage, CardType } from "@ptcg/common";

export class PokemonLeagueHeadquarters extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public regulationMark = 'G';

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '192';

  public name: string = 'Pokémon League Headquarters';

  public fullName: string = 'Pokémon League Headquarters OBF';

  public text: string =
    'Attacks used by each Basic Pokémon in play (both yours and your opponent\'s) cost C more.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckAttackCostEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard && pokemonCard.stage == Stage.BASIC) {
        const index = effect.cost.indexOf(CardType.COLORLESS);
        if (index > -1) {
          effect.cost.splice(index, 0, CardType.COLORLESS);
        } else {
          effect.cost.push(CardType.COLORLESS);
        }
        return state;
      }
      return state;
    }
    return state;
  }
}

