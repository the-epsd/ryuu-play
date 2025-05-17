import { StoreLike, State, TrainerEffect, StateUtils, PokemonCard, EnergyCard, EnergyType, GameError, GameMessage, Card, ChooseCardsPrompt, GameLog, ShowCardsPrompt, ShuffleDeckPrompt, TrainerCard, TrainerType, Effect } from "@ptcg/common";

function* playCard(next: Function, store: StoreLike, state: State,
  self: SuperRod, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  /*const blocked: number[] = [];
  // Use Set for O(1) lookup
  const blockedSet = new Set(blocked);

  // Single filter pass for valid cards
  const validCards = player.discard.cards.filter((c, index) => {
    if (blockedSet.has(index)) return false;
    return c instanceof PokemonCard ||
      (c instanceof EnergyCard && c.energyType === EnergyType.BASIC);
  });

  if (validCards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }*/

  let pokemonsOrEnergyInDiscard: number = 0;
  const blocked: number[] = [];
  player.discard.cards.forEach((c, index) => {
    const isPokemon = c instanceof PokemonCard;
    const isBasicEnergy = c instanceof EnergyCard && c.energyType === EnergyType.BASIC;
    if (isPokemon || isBasicEnergy) {
      pokemonsOrEnergyInDiscard += 1;
    } else {
      blocked.push(index);
    }
  });

  // Player does not have correct cards in discard
  if (pokemonsOrEnergyInDiscard === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  effect.preventDefault = true;

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DECK,
    player.discard,
    {},
    { min: 1, max: 3, allowCancel: false, blocked }
  ), selected => {
    cards = selected || [];
    next();
  });

  cards.forEach((card, index) => {
    store.log(state, GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
  });

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(
      opponent.id,
      GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => next());
  }

  player.discard.moveCardsTo(cards, player.deck);
  player.supporter.moveCardTo(effect.trainerCard, player.discard);

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class SuperRod extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '188';

  public name: string = 'Super Rod';

  public fullName: string = 'Super Rod PAL';

  public text: string =
    'Shuffle 3 in any combination of Pokemon and basic Energy cards from ' +
    'your discard pile back into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}
