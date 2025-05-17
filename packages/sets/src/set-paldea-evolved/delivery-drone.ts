import { StoreLike, State, TrainerEffect, CoinFlipPrompt, GameMessage, ChooseCardsPrompt, ShuffleDeckPrompt, TrainerCard, TrainerType, Effect } from "@ptcg/common";

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  let coin1Result = false;
  let coin2Result = false;

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), (result: boolean) => {
    coin1Result = result;
    next();
  });
  yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), (result: boolean) => {
    coin2Result = result;
    next();
  });
  if (coin1Result && coin2Result) {
    let cards: any[] = [];
    yield store.prompt(state, new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      {},
      { min: 0, max: 1, allowCancel: false }),
    (selected: any[]) => {
      cards = selected || [];
      next();
    });
    player.deck.moveCardsTo(cards, player.hand);
  }

  player.supporter.moveCardTo(effect.trainerCard, player.discard);

  return store.prompt(state, new ShuffleDeckPrompt(player.id), (order: any[]) => {
    player.deck.applyOrder(order);
  });
}

export class DeliveryDrone extends TrainerCard {

  public regulationMark = 'G';

  public trainerType = TrainerType.ITEM;
  public set = 'PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '178';
  public name = 'Delivery Drone';
  public fullName: string = 'Delivery Drone PAL';
  public text: string = 'Flip 2 coins. If both of them are heads, search your deck for a card and put it into your hand. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}                         