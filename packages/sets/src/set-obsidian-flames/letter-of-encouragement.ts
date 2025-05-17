import { StoreLike, State, TrainerEffect, GameError, GameMessage, Card, ChooseCardsPrompt, SuperType, EnergyType, ShuffleDeckPrompt, TrainerCard, TrainerType, Effect, KnockOutEffect, StateUtils, GamePhase, EndTurnEffect } from "@ptcg/common";

function* playCard(next: Function, store: StoreLike, state: State,
  self: LetterOfEncouragement, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  // No Pokemon KO last turn
  if (!player.marker.hasMarker(self.LETTER_OF_ENCOURAGEMENT_MARKER)) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  let cards: Card[] = [];
  return store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
    { min: 0, max: 3, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();

    player.deck.moveCardsTo(cards, player.hand);

    player.supporter.moveCardTo(effect.trainerCard, player.discard);

    return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
      player.deck.applyOrder(order);
    });
  });
}

export class LetterOfEncouragement extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '189';
  public regulationMark = 'G';
  public name: string = 'Letter of Encouragement';
  public fullName: string = 'Letter of Encouragement OBF';
  public text: string = `You can use this card only if any of your Pokémon were Knocked Out during your opponent's last turn.

Search your deck for up to 3 Basic Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.`;

  public readonly LETTER_OF_ENCOURAGEMENT_MARKER = 'LETTER_OF_ENCOURAGEMENT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    if (effect instanceof KnockOutEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const duringTurn = [GamePhase.PLAYER_TURN, GamePhase.ATTACK].includes(state.phase);

      // Do not activate between turns, or when it's not opponents turn.
      if (!duringTurn || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner === player) {
        effect.player.marker.addMarker(this.LETTER_OF_ENCOURAGEMENT_MARKER, this);
      }
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.LETTER_OF_ENCOURAGEMENT_MARKER);
    }

    return state;
  }

}