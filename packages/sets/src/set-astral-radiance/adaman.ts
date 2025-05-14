import { StoreLike, State, Effect, StateUtils, Card, CardList, ChooseCardsPrompt, EnergyCard, EnergyType, GameError, GameMessage, ShowCardsPrompt, ShuffleDeckPrompt, SuperType, TrainerCard, TrainerEffect, TrainerType } from '@ptcg/common';


function* playCard(next: Function, store: StoreLike, state: State,
  self: Adaman, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  const hasEnergyInHand = player.hand.cards.filter(c => {
    return c instanceof EnergyCard && c.name === 'Metal Energy';
  }).length >= 2;

  if (!hasEnergyInHand) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }


  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  // prepare card list without Junk Arm
  const handTemp = new CardList();
  handTemp.cards = player.hand.cards.filter(c => c !== self);

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    handTemp,
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Metal Energy' },
    { min: 2, max: 2, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  // Operation canceled by the user
  if (cards.length === 0) {
    return state;
  }

  player.hand.moveCardsTo(cards, player.discard);

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    {},
    { min: 1, max: 2, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(
      opponent.id,
      GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => next());
  }

  player.deck.moveCardsTo(cards, player.hand);
  player.supporter.moveCardTo(effect.trainerCard, player.discard);


  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Adaman extends TrainerCard {

  public regulationMark = 'F';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'ASR';

  public setNumber: string = '135';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Adaman';

  public fullName: string = 'Adaman ASR';

  public text: string =
    'You can use this card only if you discard 2 [M] Energy cards from your hand.' +
    '' +
    'Search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }

}
