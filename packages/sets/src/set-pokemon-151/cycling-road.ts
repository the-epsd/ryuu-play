import { TrainerCard, TrainerType, StoreLike, State, Effect, UseStadiumEffect, StateUtils, EnergyCard, GameError, GameMessage, ChooseCardsPrompt, SuperType } from "@ptcg/common";

export class CyclingRoad extends TrainerCard {
  
  public trainerType = TrainerType.STADIUM;

  public regulationMark = 'G';

  public set = 'MEW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '157';

  public name = 'Cycling Road';

  public fullName = 'Cycling Road MEW';

  public text = 'Once during each player\'s turn, that player may discard a Basic Energy card from their hand in order to draw a card.';
    
  reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      return this.useStadium(store, state, effect);
    }
    return state;
  }
    
  useStadium(store: StoreLike, state: State, effect: UseStadiumEffect): State {

    const player = effect.player;
    const hasEnergyInHand = player.hand.cards.some(c => {
      return c instanceof EnergyCard;
    });
    if (!hasEnergyInHand) {
      throw new GameError(GameMessage.CANNOT_USE_POWER);
    }

    state = store.prompt(state, new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      player.hand,
      { superType: SuperType.ENERGY },
      { allowCancel: true, min: 1, max: 1 }
    ), cards => {
      cards = cards || [];
      if (cards.length === 0) {
        return;
      }

      player.hand.moveCardsTo(cards, player.discard);
      player.deck.moveTo(player.hand, 1);
      

    });

    return state;
  }
}