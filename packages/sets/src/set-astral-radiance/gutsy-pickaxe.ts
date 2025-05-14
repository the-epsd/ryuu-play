import { StoreLike, State, Effect, AttachEnergyPrompt, CardList, EnergyCard, EnergyType, GameMessage, PlayerType, ShowCardsPrompt, SlotType, StateUtils, SuperType, TrainerCard, TrainerEffect, TrainerType, MOVE_CARDS } from '@ptcg/common';

export class GutsyPickaxe extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '145';

  public name: string = 'Gutsy Pickaxe';

  public fullName: string = 'Gutsy Pickaxe ASR';

  public text: string =
    'Look at the top card of your deck. You may attach it to 1 of your Benched Pokémon if it\'s a [F] Energy card. ' +
    'If you don\'t attach it, put it into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const temp = new CardList();

      MOVE_CARDS(store, state, player.deck, temp, { count: 1 });

      // Check if any cards drawn are basic energy
      const energyCardsDrawn = temp.cards.filter(card => {
        return card instanceof EnergyCard &&
          card.energyType === EnergyType.BASIC &&
          card.name === 'Fighting Energy';
      });

      if (temp.cards.length === 0) {
        return state;
      }

      return store.prompt(state, new ShowCardsPrompt(
        opponent.id,
        GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
        temp.cards
      ), () => {
        if (energyCardsDrawn.length === 0) {
          return store.prompt(state, new ShowCardsPrompt(
            player.id,
            GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
            temp.cards
          ), () => {
            MOVE_CARDS(store, state, temp, player.hand);
            MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [effect.trainerCard] });
          });
        }

        // Prompt to attach energy if any were drawn
        return store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          temp,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
          { min: 0, allowCancel: false, max: energyCardsDrawn.length }
        ), transfers => {
          if (transfers) {
            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              MOVE_CARDS(store, state, temp, target, { cards: [transfer.card] });
            }
          }

          // Move remaining cards to hand
          MOVE_CARDS(store, state, temp, player.hand);
          MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [effect.trainerCard] });
        });
      });
    }
    return state;
  }
}