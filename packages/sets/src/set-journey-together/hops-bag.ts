import { StoreLike, State, Effect, Card, CardTag, ChooseCardsPrompt, GameError, GameMessage, PokemonCardList, ShuffleDeckPrompt, Stage, SuperType, TrainerCard, TrainerEffect, TrainerType } from '@ptcg/common';

export class HopsBag extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'JTG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '147';
  public regulationMark = 'I';
  public name: string = 'Hop\'s Bag';
  public fullName: string = 'Hop\'s Bag JTG';
  public text: string = 'Search your deck for up to 2 Basic Hop\'s Pokémon and put them onto your Bench. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      effect.preventDefault = true;
      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      // Allow player to search deck and choose up to 2 Basic Pokemon
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      // Check if bench has open slots
      const openSlots = player.bench.filter(b => b.cards.length === 0);

      if (openSlots.length === 0) {
        // No open slots, throw error
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const blocked = player.deck.cards
        .filter(c => !c.tags.includes(CardTag.HOPS))
        .map(c => player.deck.cards.indexOf(c));

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const maxCards = Math.min(2, openSlots.length);

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.deck,
        { superType: SuperType.POKEMON, stage: Stage.BASIC },
        { min: 0, max: maxCards, allowCancel: false, blocked: blocked }
      ), selectedCards => {
        cards = selectedCards || [];

        cards.forEach((card, index) => {
          player.deck.moveCardTo(card, slots[index]);
          slots[index].pokemonPlayedTurn = state.turn;
        });

        player.supporter.moveCardTo(this, player.discard);

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
          return state;
        }
        );
      });
    }
    return state;
  }
}