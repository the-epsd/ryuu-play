import { StoreLike, State, TrainerEffect, StateUtils, EnergyCard, EnergyType, GameError, GameMessage, ChooseCardsPrompt, SuperType, GameLog, ShowCardsPrompt, TrainerCard, TrainerType, Effect, MOVE_CARDS, MOVE_CARD_TO } from "@ptcg/common";

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // Player has no Basic Energy in the discard pile
  let basicEnergyCards = 0;
  player.discard.cards.forEach(c => {
    if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC) {
      basicEnergyCards++;
    }
  });
  if (basicEnergyCards === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  const min = Math.min(basicEnergyCards, 2);
  return store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.discard,
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
    { min: 1, max: min, allowCancel: false }
  ), cards => {
    cards = cards || [];

    if (cards.length > 0) {
      MOVE_CARDS(store, state, player.discard, player.hand, { cards });
      cards.forEach((card, index) => {
        store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
      });
      if (cards.length > 0) {
        state = store.prompt(state, new ShowCardsPrompt(
          opponent.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          cards), () => state);
      }
      MOVE_CARD_TO(state, effect.trainerCard, player.discard);
    }
  });
}

export class EnergyRetrieval extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'SVI';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '171';
  public name: string = 'Energy Retrieval';
  public fullName: string = 'Energy Retrieval SVI';
  public text: string = 'Put 2 basic Energy cards from your discard pile into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
}