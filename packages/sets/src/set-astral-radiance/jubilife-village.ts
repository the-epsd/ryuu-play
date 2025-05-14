import { StoreLike, State, Effect, EndTurnEffect, GameError, GameLog, GameMessage, ShuffleDeckPrompt, StateUtils, TrainerCard, TrainerType, UseStadiumEffect, MOVE_CARDS } from '@ptcg/common';

export class JubilifeVillage extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'ASR';

  public regulationMark = 'F';

  public name: string = 'Jubilife Village';

  public cardImage: string = 'assets/cardback.png';

  public fullName: string = 'Jubilife Village ASR';

  public setNumber: string = '148';

  public text: string =
    'Once during each player\'s turn, that player may shuffle their hand into their deck and draw 5 cards. If they do, their turn ends.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0 && player.hand.cards.length == 0) {
        throw new GameError(GameMessage.CANNOT_USE_STADIUM);
      }

      const cards = player.hand.cards.filter(c => c !== this);
      MOVE_CARDS(store, state, player.hand, player.deck, { cards: cards });

      state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
      });

      MOVE_CARDS(store, state, player.deck, player.hand, { count: 5 });

      effect.preventDefault = true;
      store.log(state, GameLog.LOG_PLAYER_USES_STADIUM, { name: player.name, stadium: effect.stadium.name });
      player.stadiumUsedTurn = state.turn;

      const endTurnEffect = new EndTurnEffect(player);
      return store.reduceEffect(state, endTurnEffect);
    }

    return state;
  }

}
