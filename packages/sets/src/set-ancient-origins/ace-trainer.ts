import { TrainerCard, TrainerType, StoreLike, State, Effect, TrainerEffect, StateUtils, GameError, GameMessage, ShuffleDeckPrompt, MOVE_CARDS } from '@ptcg/common';

export class AceTrainer extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'AOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';
  public name: string = 'Ace Trainer';
  public fullName: string = 'Ace Trainer AOR';

  public text: string =
    'You can play this card only if you have more Prize cards left than your opponent.\n\nEach player shuffles his or her hand into his or her deck. Then, draw 6 cards. Your opponent draws 3 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const cards = player.hand.cards.filter(c => c !== this);

      player.hand.moveCardsTo(cards, player.deck);
      MOVE_CARDS(store, state, opponent.hand, opponent.deck);

      store.prompt(state, [
        new ShuffleDeckPrompt(player.id),
        new ShuffleDeckPrompt(opponent.id)
      ], deckOrder => {
        player.deck.applyOrder(deckOrder[0]);
        opponent.deck.applyOrder(deckOrder[1]);

        MOVE_CARDS(store, state, player.deck, player.hand, { count: 6 });
        MOVE_CARDS(store, state, opponent.deck, opponent.hand, { count: 3 });
      });
    }
    return state;
  }
}