import { StoreLike, State, Effect, CardList, GameError, GameMessage, TrainerCard, TrainerEffect, TrainerType, ConfirmCardsPrompt, MOVE_CARDS } from '@ptcg/common';

export class TrekkingShoes extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'ASR';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '156';

  public name: string = 'Trekking Shoes';

  public fullName: string = 'Trekking Shoes ASR';

  public text: string =
    'Look at the top card of your deck. You may put that card into your hand. If you don\'t, discard that card and draw a card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      // Look at top card
      const deckTop = new CardList();
      MOVE_CARDS(store, state, player.deck, deckTop, { count: 1 });

      return store.prompt(state, new ConfirmCardsPrompt(
        player.id,
        GameMessage.TREKKING_SHOES,
        deckTop.cards,
        { allowCancel: true }
      ), selected => {
        if (selected !== null) {
          // Add card to hand
          MOVE_CARDS(store, state, deckTop, player.hand);
        } else {
          // Discard card and draw a new one
          MOVE_CARDS(store, state, deckTop, player.discard);
          MOVE_CARDS(store, state, player.deck, player.hand, { count: 1 });
        }

        // Discard Trekking Shoes
        MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [effect.trainerCard] });
      });
    }
    return state;
  }
}