import { StoreLike, State, TrainerEffect, StateUtils, PokemonCardList, GameError, GameMessage, Card, ChooseCardsPrompt, SuperType, Stage, SupporterEffect, TrainerCard, TrainerType, Effect } from "@ptcg/common";

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const slots: PokemonCardList[] = opponent.bench.filter(b => b.cards.length === 0);

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  if (opponent.hand.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }
  // Check if bench has open slots
  const openSlots = opponent.bench.filter(b => b.cards.length === 0);

  if (openSlots.length === 0) {
    // No open slots, throw error
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }


  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    opponent.hand,
    { superType: SuperType.POKEMON, stage: Stage.BASIC },
    { min: 0, max: 1, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.supporter.moveCardTo(effect.trainerCard, player.discard);

  // Operation canceled by the user
  if (cards.length === 0) {
    return state;
  }

  try {
    const supporterEffect = new SupporterEffect(player, effect.trainerCard);
    store.reduceEffect(state, supporterEffect);
  } catch {
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
  }

  cards.forEach((card, index) => {
    opponent.hand.moveCardTo(card, slots[index]);
    slots[index].pokemonPlayedTurn = state.turn;
    opponent.switchPokemon(slots[index]);
  });


}
export class EreikasInvitation extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'MEW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '160';

  public name: string = 'Erika\'s Invitation';

  public fullName: string = 'Erika\'s Invitation MEW';

  public text: string =
    'Your opponent reveals their hand, and you put a Basic Pokémon you find there onto your opponent\'s Bench. If you put a Pokémon onto their Bench in this way, switch in that Pokémon to the Active Spot.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
