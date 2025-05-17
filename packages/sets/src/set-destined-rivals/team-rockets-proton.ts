import { TrainerCard, CardTag, TrainerType, StoreLike, State, Effect, TrainerEffect, StateUtils, GameError, GameMessage, Card, ChooseCardsPrompt, SuperType, Stage, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK } from "@ptcg/common";

export class TeamRocketsProton extends TrainerCard {
  public regulationMark = 'I';
  public tags = [CardTag.TEAM_ROCKET];
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'SV10';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '95';
  public name: string = 'Team Rocket\'s Proton';
  public fullName: string = 'Team Rocket\'s Proton SV10';
  public firstTurn = true;

  public text: string =
    `If you go first, you may use this card during your first turn.

Search your deck for up to 3 Basic Team Rocket's Pokémon, reveal them, and put them into your hand. Then, shuffle your deck.`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      effect.preventDefault = true;
      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const blocked = player.deck.cards
        .filter(c => !c.tags.includes(CardTag.TEAM_ROCKET))
        .map(c => player.deck.cards.indexOf(c));

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.deck,
        { superType: SuperType.POKEMON, stage: Stage.BASIC },
        { min: 0, max: 3, allowCancel: false, blocked: blocked }
      ), selectedCards => {
        cards = selectedCards || [];

        player.deck.moveCardsTo(cards, player.hand);
        SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        player.supporter.moveCardTo(this, player.discard);
        SHUFFLE_DECK(store, state, player);
      });
    }

    return state;
  }

}
