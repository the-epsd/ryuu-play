import { TrainerCard, TrainerType, StoreLike, State, Effect, PutDamageEffect, StateUtils, PokemonCard, CardTag, UseStadiumEffect, GameError, GameMessage } from "@ptcg/common";

export class GraniteCave extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;
  public regulationMark: string = 'I';
  public set: string = 'SVOD';
  public setNumber: string = '18';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Granite Cave';
  public fullName: string = 'Granite Cave SVOD';

  public text: string =
    'Steven\'s Pokémon (both yours and your opponent\'s) take 30 less damage from attacks from the opponent\'s Pokémon (after applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && StateUtils.getStadiumCard(state) === this) {
      const card = effect.target.getPokemonCard() as PokemonCard;

      if (card.tags.includes(CardTag.STEVENS)) {
        effect.damage = Math.max(0, effect.damage - 30);
      }
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }

}
