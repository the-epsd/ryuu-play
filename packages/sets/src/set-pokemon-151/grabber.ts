import { TrainerCard, TrainerType, StoreLike, State, Effect, TrainerEffect, StateUtils, CardList, ChooseCardsPrompt, GameMessage, SuperType } from "@ptcg/common";

export class Grabber extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'MEW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '162';

  public name: string = 'Grabber';

  public fullName: string = 'Grabber MEW';

  public text: string =
    'Your opponent reveals their hand, and you put a Pokémon you find there on the bottom of their deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const deckBottom = new CardList();

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DECK,
        opponent.hand,
        { superType: SuperType.POKEMON },
        { allowCancel: false, min: 0, max: 1 }
      ), selectedCard => {
        const selected = selectedCard || [];
        if (selectedCard === null || selected.length === 0) {
          player.supporter.moveCardTo(this, player.discard);
          return;
        }

        opponent.hand.moveCardTo(selected[0], deckBottom);
        deckBottom.moveTo(opponent.deck);

        player.supporter.moveCardTo(this, player.discard);

      });
    }
    return state;
  }


}