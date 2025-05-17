import { StoreLike, State, TrainerEffect, StateUtils, Card, GameError, GameMessage, ChooseCardsPrompt, SuperType, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, TrainerCard, TrainerType, CardTag, Effect } from "@ptcg/common";

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.TRAINER },
    { min: 0, max: 1, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.deck.moveCardsTo(cards, player.hand);

  SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
  player.supporter.moveCardTo(effect.trainerCard, player.discard);

  SHUFFLE_DECK(store, state, player);
}

export class TeamRocketsPetrel extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public tags = [CardTag.TEAM_ROCKET];
  public set: string = 'SV10';
  public name: string = 'Team Rocket\'s Petrel';
  public fullName: string = 'Team Rocket\'s Petrel SV10';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '94';
  public regulationMark = 'I';

  public text: string =
    'Search your deck for a Trainer card, reveal it, and put it into your hand. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
