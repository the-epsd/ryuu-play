import { StoreLike, State, TrainerEffect, StateUtils, GameError, GameMessage, CardList, ChooseCardsPrompt, SuperType, GameLog, ShowCardsPrompt, ShuffleDeckPrompt, TrainerCard, TrainerType, Effect } from "@ptcg/common";

function* playCard(next: Function, store: StoreLike, state: State,
  self: UltraBall, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.hand.cards.filter(c => c !== self).length < 2 || player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  effect.preventDefault = true;

  const handTemp = new CardList();
  handTemp.cards = player.hand.cards.filter(c => c !== self);

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    handTemp,
    {},
    { min: 2, max: 2, allowCancel: false }
  ), selected => {
    if (selected) {
      player.hand.moveCardsTo(selected, player.discard);
    }
    next();
  });

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.POKEMON },
    { min: 0, max: 1, allowCancel: false }
  ), selected => {
    if (selected && selected.length > 0) {
      player.deck.moveCardsTo(selected, player.hand);
      store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: selected[0].name });

      store.prompt(state, new ShowCardsPrompt(
        opponent.id,
        GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
        selected
      ), () => next());
    } else {
      next();
    }
  });

  player.supporter.moveCardTo(effect.trainerCard, player.discard);
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class UltraBall extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '196';

  public name: string = 'Ultra Ball';

  public fullName: string = 'Ultra Ball SVI';

  public text: string =
    'Discard 2 cards from your hand. (If you can\'t discard 2 cards, you ' +
    'can\'t play this card.) Search your deck for a Pokemon, reveal it, and ' +
    'put it into your hand. Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }

}
