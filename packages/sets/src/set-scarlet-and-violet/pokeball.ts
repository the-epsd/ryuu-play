import { StoreLike, State, TrainerEffect, StateUtils, CoinFlipPrompt, GameMessage, ChooseCardsPrompt, SuperType, GameLog, ShowCardsPrompt, ShuffleDeckPrompt, TrainerCard, TrainerType, Effect } from "@ptcg/common";

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let coinResult = false;

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), (result: boolean) => {
    coinResult = result;
    next();
  });

  if (coinResult) { 
    let cards: any[] = [];
    yield store.prompt(state, new ChooseCardsPrompt(
      player, 
      GameMessage.CHOOSE_CARD_TO_HAND, 
      player.deck, 
      { superType: SuperType.POKEMON }, 
      { min: 0, max: 1, allowCancel: false }), 
    (selected: any[]) => {
      cards = selected || [];
      next();
    });

    if (cards.length > 0) {
      player.discard.moveCardsTo(cards, player.deck);
      cards.forEach((card, index) => {
        store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
      });
      if (cards.length > 0) {
        state = store.prompt(state, new ShowCardsPrompt(
          opponent.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          cards), () => state);
      }
    }

    player.deck.moveCardsTo(cards, player.hand);
  }

  player.supporter.moveCardTo(effect.trainerCard, player.discard);
  return store.prompt(state, new ShuffleDeckPrompt(player.id), (order: any[]) => {
    player.deck.applyOrder(order);
  });
}

export class Pokeball extends TrainerCard {

  public regulationMark = 'G';
  
  public trainerType = TrainerType.ITEM;

  public set = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '185';

  public name = 'Poké Ball';

  public fullName: string = 'Poké Ball SVI';

  public text: string = 'Flip a coin. If heads, search your deck for a Pokémon, reveal it, and put it into your hand. Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }                
    return state;
  }
}                         