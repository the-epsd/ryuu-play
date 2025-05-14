import { StoreLike, State, Effect, CardList, ChooseCardsPrompt, CoinFlipPrompt, GameError, GameMessage, OrderCardsPrompt, ShowCardsPrompt, StateUtils, TrainerCard, TrainerEffect, TrainerToDeckEffect, TrainerType, MOVE_CARDS } from '@ptcg/common';

export class Cyllene extends TrainerCard {

  public regulationMark = 'F';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'ASR';

  public setNumber: string = '138';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Cyllene';

  public fullName: string = 'Cyllene ASR';

  public text: string =
    'Flip 2 coins. For each heads, put a card from your discard pile on top of your deck. ' +
    'If you put any Trainer cards there this way, your opponent may prevent this effect. ' +
    'If they do, put those Trainer cards back into your discard pile.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, { cards: [effect.trainerCard] });
      effect.preventDefault = true;

      let heads: number = 0;
      store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        results.forEach(r => { heads += r ? 1 : 0; });

        if (heads === 0) {
          MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [effect.trainerCard] });
          return state;
        }

        const deckTop = new CardList();

        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK,
          player.discard,
          {},
          { min: Math.min(heads, player.discard.cards.length), max: heads, allowCancel: false }
        ), selected => {
          const cards = selected || [];

          const trainerCards = cards.filter(card => card instanceof TrainerCard);
          const nonTrainerCards = cards.filter(card => !(card instanceof TrainerCard));

          let canMoveTrainerCards = true;
          if (trainerCards.length > 0) {
            const discardEffect = new TrainerToDeckEffect(player, this);
            store.reduceEffect(state, discardEffect);
            canMoveTrainerCards = !discardEffect.preventDefault;
          }

          const cardsToMove = canMoveTrainerCards ? cards : nonTrainerCards;

          if (cardsToMove.length > 0) {
            MOVE_CARDS(store, state, player.discard, deckTop, { cards: cardsToMove });

            return store.prompt(state, new OrderCardsPrompt(
              player.id,
              GameMessage.CHOOSE_CARDS_ORDER,
              deckTop,
              { allowCancel: false },
            ), order => {
              if (order === null) {
                return state;
              }

              deckTop.applyOrder(order);
              MOVE_CARDS(store, state, deckTop, player.deck, { toTop: true });
              MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [effect.trainerCard] });

              if (cardsToMove.length > 0) {
                return store.prompt(state, new ShowCardsPrompt(
                  opponent.id,
                  GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
                  cardsToMove
                ), () => state);
              }

              return state;
            });
          }
          MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [effect.trainerCard] });
          return state;
        });
      });
    }
    return state;
  }
}