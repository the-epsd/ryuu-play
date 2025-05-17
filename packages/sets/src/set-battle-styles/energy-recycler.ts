import { Card, ChooseCardsPrompt, Effect, EnergyCard, EnergyType, GameError, GameMessage, MOVE_CARDS, ShuffleDeckPrompt, State, StoreLike, SuperType, TrainerCard, TrainerEffect, TrainerType } from "@ptcg/common";

function* playCard(next: Function, store: StoreLike, state: State,
  self: EnergyRecycler, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  let energyInDiscard: number = 0;
  const blocked: number[] = [];
  player.discard.cards.forEach((c, index) => {
    const isBasicEnergy = c instanceof EnergyCard && c.energyType === EnergyType.BASIC;
    if (isBasicEnergy) {
      energyInDiscard += 1;
    } else {
      blocked.push(index);
    }
  });

  // Player does not have correct cards in discard
  if (energyInDiscard === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DECK,
    player.discard,
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
    { min: 1, max: 5, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  state = MOVE_CARDS(store, state, player.discard, player.deck, { cards });
  state = MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [effect.trainerCard] });

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class EnergyRecycler extends TrainerCard {
  public regulationMark = 'E';
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'BST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '124';
  public name: string = 'Energy Recycler';
  public fullName: string = 'Energy Recycler BST';
  public text: string = 'Shuffle up to 5 basic Energy cards from your discard pile into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }
}