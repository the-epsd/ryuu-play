import { StoreLike, State, TrainerEffect, PokemonCardList, GameError, GameMessage, Card, ChooseCardsPrompt, SuperType, Stage, SHUFFLE_DECK, GameLog, TrainerCard, TrainerType, Effect } from "@ptcg/common";

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

  // No cards left in deck
  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }
  // Check if bench has open slots
  const openSlots = player.bench.filter(b => b.cards.length === 0);

  // No open slots, throw error
  if (openSlots.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
    player.deck,
    { superType: SuperType.POKEMON, stage: Stage.BASIC },
    { min: 0, max: 1, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  // Operation canceled by the user
  if (cards.length === 0) {
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    SHUFFLE_DECK(store, state, player);
    return state;
  }

  cards.forEach((card, index) => {
    player.deck.moveCardTo(card, slots[index]);
    slots[index].pokemonPlayedTurn = state.turn;
    store.log(state, GameLog.LOG_PLAYER_PLAYS_BASIC_POKEMON, { name: player.name, card: card.name });
  });

  player.supporter.moveCardTo(effect.trainerCard, player.discard);

  SHUFFLE_DECK(store, state, player);
  return state;
}
export class NestBall extends TrainerCard {

  public regulationMark = 'G';
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '181';
  public name: string = 'Nest Ball';
  public fullName: string = 'Nest Ball SVI';
  public text: string = 'Search your deck for a Basic Pokémon and put it onto your Bench. Then, shuffle your deck.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
