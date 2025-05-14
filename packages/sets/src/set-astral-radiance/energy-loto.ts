import { StoreLike, State, Effect, CardList, ChooseCardsPrompt, GameLog, GameMessage, ShowCardsPrompt, ShuffleDeckPrompt, StateUtils, SuperType, TrainerCard, TrainerEffect, TrainerType, MOVE_CARDS } from '@ptcg/common';

export class EnergyLoto extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '140';

  public name: string = 'Energy Loto';

  public fullName: string = 'Energy Loto ASR';

  public text: string =
    'Look at the top 7 cards of your deck. You may reveal an Energy card you find there and put it into your hand. Shuffle the other cards back into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const temp = new CardList();

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      MOVE_CARDS(store, state, player.deck, temp, { count: 7 });

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        temp,
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 0, max: 1 }
      ), chosenCards => {

        if (chosenCards.length === 0) {
          // No Energy chosen, shuffle all back
          MOVE_CARDS(store, state, temp, player.deck);
          MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [this] });
        }

        if (chosenCards.length > 0) {
          // Move chosen Energy to hand
          const energyCard = chosenCards[0];
          MOVE_CARDS(store, state, temp, player.hand, { cards: [energyCard] });
          MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [this] });
          MOVE_CARDS(store, state, temp, player.deck);

          chosenCards.forEach((card, index) => {
            store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
          });

          if (chosenCards.length > 0) {
            state = store.prompt(state, new ShowCardsPrompt(
              opponent.id,
              GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
              chosenCards), () => state);
          }
        }
        MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [this] });

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }
    return state;
  }
}