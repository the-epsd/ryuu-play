import { StoreLike, State, TrainerEffect, StateUtils, Card, GameError, GameMessage, TrainerCard, TrainerType, CardTag, ChooseCardsPrompt, GameLog, ShowCardsPrompt, ShuffleDeckPrompt, Effect } from "@ptcg/common";

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  effect.preventDefault = true;

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Create a blocked array for non-Team Rocket Supporter cards
  const blocked: number[] = [];
  player.deck.cards.forEach((card, index) => {
    if (!(card instanceof TrainerCard) ||
      card.trainerType !== TrainerType.SUPPORTER ||
      !card.tags.includes(CardTag.TEAM_ROCKET)) {
      blocked.push(index);
    }
  });

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    {},
    { min: 0, max: 1, allowCancel: false, blocked }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.deck.moveCardsTo(cards, player.hand);

  cards.forEach((card) => {
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

export class TeamRocketsReceiver extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public tags = [CardTag.TEAM_ROCKET];

  public regulationMark = 'I';

  public set: string = 'SV10';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '90';

  public name: string = 'Team Rocket\'s Receiver';

  public fullName: string = 'Team Rocket\'s Receiver SV10';

  public text: string =
    'Search your deck for 1 Supporter with "Team Rocket" in its name, reveal it, and put it into your hand. Then shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}