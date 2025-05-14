import { StoreLike, State, Effect, Card, CardType, ChooseCardsPrompt, GameError, GameLog, GameMessage, PokemonCard, ShowCardsPrompt, ShuffleDeckPrompt, StateUtils, TrainerCard, TrainerEffect, TrainerType } from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State,
  self: Irida, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  // Count pokemons and items separately
  let pokemons = 0;
  let items = 0;
  const blocked: number[] = [];
  player.deck.cards.forEach((c, index) => {
    if (c instanceof PokemonCard && c.cardType === CardType.WATER) {
      pokemons += 1;
    } else if (c instanceof TrainerCard && c.trainerType === TrainerType.ITEM) {
      items += 1;
    } else {
      blocked.push(index);
    }
  });

  // Limit max for each type to 1
  const maxPokemons = Math.min(pokemons, 1);
  const maxItems = Math.min(items, 1);

  // Total max is sum of max for each 
  const count = maxPokemons + maxItems;

  // Pass max counts to prompt options
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    {},
    { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxItems }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.deck.moveCardsTo(cards, player.hand);
  player.supporter.moveCardTo(effect.trainerCard, player.discard);


  cards.forEach((card, index) => {
    store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
  });

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(
      opponent.id,
      GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => next());
  }
  player.supporter.moveCardTo(effect.trainerCard, player.discard);
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Irida extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '147';

  public name: string = 'Irida';

  public fullName: string = 'Irida ASR';

  public text: string =
    'Search your deck for a W Pokemon and an Item ' +
    'card, reveal them, and put them into your hand. ' +
    'Then, shuffle your deck.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}
