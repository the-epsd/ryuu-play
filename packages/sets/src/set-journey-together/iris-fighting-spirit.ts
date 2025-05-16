import { StoreLike, State, Effect, ChooseCardsPrompt, DRAW_CARDS_UNTIL_CARDS_IN_HAND, GameMessage, TrainerCard, TrainerEffect, TrainerType } from '@ptcg/common';

export class IrisFightingSpirit extends TrainerCard {
  public regulationMark = 'I';
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'JTG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '149';
  public name: string = 'Iris\'s Fighting Spirit';
  public fullName: string = 'Iris\'s Fighting Spirit JTG';

  public text: string = `You can use this card only if you discard another card from your hand.

Draw cards until you have 6 cards in your hand.`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { allowCancel: false, min: 0, max: 1 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }
        player.hand.moveCardsTo(cards, player.discard);
        if (player.hand.cards.length >= 6) {
          return;
        }

        DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 6);
      });

      return state;
    }
    return state;
  }
}