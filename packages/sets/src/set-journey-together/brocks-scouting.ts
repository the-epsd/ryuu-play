import { StoreLike, State, Effect, Card, ChooseCardsPrompt, GameError, GameLog, GameMessage, PokemonCard, ShowCardsPrompt, ShuffleDeckPrompt, Stage, StateUtils, TrainerCard, TrainerEffect, TrainerType } from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State,
  self: BrocksScouting, effect: TrainerEffect): IterableIterator<State> {
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

  // Count tools and items separately
  let basics = 0;
  let evolutions = 0;
  const blocked: number[] = [];
  player.deck.cards.forEach((c, index) => {
    if (c instanceof PokemonCard && c.stage === Stage.BASIC) {
      basics += 1;
    } else if (c instanceof PokemonCard && c.stage !== Stage.BASIC) {
      evolutions += 1;
    } else {
      blocked.push(index);
    }
  });

  // Limit max for each type to 1
  const maxBasics = Math.min(basics, 2);
  const maxEvolutions = Math.min(evolutions, 1);

  // Total max is sum of max for each 
  const count = maxBasics + maxEvolutions;

  // Pass max counts to prompt options
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    {},
    { min: 0, max: count, allowCancel: false, blocked, maxBasics, maxEvolutions }
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

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class BrocksScouting extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'I';
  public set: string = 'JTG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '146';
  public name: string = 'Brock\'s Scouting';
  public fullName: string = 'Brock\'s Scouting JTG';
  public text: string = 'Search your deck for up to 2 Basic Pokémon or 1 Evolution Pokémon, reveal them, and put them into your hand. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }
}