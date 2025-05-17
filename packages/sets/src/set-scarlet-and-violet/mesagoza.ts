import { TrainerCard, TrainerType, StoreLike, State, Effect, UseStadiumEffect, StateUtils, CoinFlipPrompt, GameMessage, ChooseCardsPrompt, SuperType, ShuffleDeckPrompt, ShowCardsPrompt } from "@ptcg/common";

export class Mesagoza extends TrainerCard {

  public trainerType = TrainerType.STADIUM;

  public regulationMark = 'G';

  public set = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '178';

  public name = 'Mesagoza';

  public fullName = 'Mesagoza SVI';

  public text = 'Once during each player\'s turn, that player may flip a coin. If heads, that player searches their deck for a Pokémon, reveals it, and puts it into their hand. Then, that player shuffles their deck.';

  reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      return this.useStadium(store, state, effect);
    }
    return state;
  }

  useStadium(store: StoreLike, state: State, effect: UseStadiumEffect): State {
    const player = effect.player;
    const opponent = StateUtils.getOpponent(state, player);

    return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), flipResult => {
      if (flipResult) {
        return store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.deck,
          { superType: SuperType.POKEMON },
          { min: 0, max: 1, allowCancel: false }
        ), selected => {
          const cards = selected || [];

          state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
          });

          if (cards.length > 0) {
            player.deck.moveCardsTo(cards, player.hand);

            return store.prompt(state, new ShowCardsPrompt(
              opponent.id,
              GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
              cards
            ), () => {
            });
          }
        });
      }
    });
    return state;
  }
}