import { TrainerCard, TrainerType, StoreLike, State, Effect, TrainerEffect, StateUtils, GameError, GameMessage, ShuffleDeckPrompt } from "@ptcg/common";

export class Judge extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '176';

  public regulationMark = 'G';

  public name: string = 'Judge';

  public fullName: string = 'Judge SVI';

  public text: string =
    'Each player shuffles their hand into their deck and draws 4 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const cards = player.hand.cards.filter(c => c !== this);

      player.hand.moveCardsTo(cards, player.deck);
      opponent.hand.moveTo(opponent.deck);

      store.prompt(state, [
        new ShuffleDeckPrompt(player.id),
        new ShuffleDeckPrompt(opponent.id)
      ], deckOrder => {
        player.deck.applyOrder(deckOrder[0]);
        opponent.deck.applyOrder(deckOrder[1]);

        player.deck.moveTo(player.hand, 4);
        opponent.deck.moveTo(opponent.hand, 4);

        player.supporter.moveCardTo(effect.trainerCard, player.discard);

      });
    }

    return state;
  }

}
