import { TrainerCard, TrainerType, StoreLike, State, Effect, TrainerEffect, StateUtils, GameError, GameMessage, MoveCardsEffect, DRAW_CARDS } from "@ptcg/common";

export class MCsHypeUp extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'SV9a';
  public setNumber = '61';
  public cardImage = 'assets/cardback.png';
  public regulationMark: string = 'H';
  public name: string = 'MC\'s Hype Up';
  public fullName: string = 'MC\'s Hype Up SV9a';
  public text: string = 'Draw 2 cards. If your opponent has 3 or fewer Prize cards remaining, draw 2 more cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Move to supporter pile
      state = store.reduceEffect(state, new MoveCardsEffect(
        player.hand,
        player.supporter,
        { cards: [effect.trainerCard] }
      ));

      effect.preventDefault = true;
      
      DRAW_CARDS(player, 2);
      if (opponent.getPrizeLeft() <= 3){
        DRAW_CARDS(player, 2);
      }

      player.supporter.moveTo(player.discard);
    }

    return state;
  }

}
