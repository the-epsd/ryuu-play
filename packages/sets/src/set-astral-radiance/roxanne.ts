import { StoreLike, State, Effect, GameError, GameMessage, ShuffleDeckPrompt, StateUtils, TrainerCard, TrainerEffect, TrainerType, MOVE_CARDS } from '@ptcg/common';

export class Roxanne extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '150';

  public regulationMark = 'F';

  public name: string = 'Roxanne';

  public fullName: string = 'Roxanne ASR';

  public text: string = 'Your opponent shuffles their hand into their deck. Then, they draw 2 cards. Shuffle your hand into your deck. Then, draw 6 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const oppPrizes = opponent.getPrizeLeft();
      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (oppPrizes > 3) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Move Roxanne to supporter
      MOVE_CARDS(store, state, player.hand, player.supporter, { cards: [effect.trainerCard] });

      // Get all cards except Roxanne
      const cards = player.hand.cards.filter(c => c !== this);

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      // Move cards to deck
      MOVE_CARDS(store, state, player.hand, player.deck, { cards });
      MOVE_CARDS(store, state, opponent.hand, opponent.deck);

      return store.prompt(state, [
        new ShuffleDeckPrompt(player.id),
        new ShuffleDeckPrompt(opponent.id)
      ], deckOrder => {
        player.deck.applyOrder(deckOrder[0]);
        opponent.deck.applyOrder(deckOrder[1]);

        // Draw new cards
        MOVE_CARDS(store, state, player.deck, player.hand, { count: 6 });
        MOVE_CARDS(store, state, opponent.deck, opponent.hand, { count: 2 });

        // Discard Roxanne
        MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [effect.trainerCard] });
      });
    }
    return state;
  }

}
