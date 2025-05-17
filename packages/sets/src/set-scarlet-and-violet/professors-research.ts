import { TrainerCard, TrainerType, StoreLike, State, Effect, TrainerEffect, GameError, GameMessage, MoveCardsEffect } from "@ptcg/common";

export class ProfessorsResearch extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '189';

  public name: string = 'Professor\'s Research';

  public fullName: string = 'Professor\'s Research SVI';

  public text: string =
    'Discard your hand and draw 7 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      // Move to supporter pile
      state = store.reduceEffect(state, new MoveCardsEffect(
        player.hand,
        player.supporter,
        { cards: [effect.trainerCard] }
      ));

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Discard hand
      const cards = player.hand.cards.filter(c => c !== this);
      state = store.reduceEffect(state, new MoveCardsEffect(
        player.hand,
        player.discard,
        { cards }
      ));

      // Draw 7 cards
      state = store.reduceEffect(state, new MoveCardsEffect(
        player.deck,
        player.hand,
        { count: 7 }
      ));

      // Discard supporter
      state = store.reduceEffect(state, new MoveCardsEffect(
        player.supporter,
        player.discard,
        { cards: [effect.trainerCard] }
      ));
    }

    return state;
  }

}
