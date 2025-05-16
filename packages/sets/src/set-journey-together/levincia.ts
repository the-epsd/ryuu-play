import { StoreLike, State, Effect, CardType, ChooseCardsPrompt, EnergyCard, EnergyType, GameError, GameMessage, StateUtils, SuperType, TrainerCard, TrainerType, UseStadiumEffect } from '@ptcg/common';

export class Levincia extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;
  public set: string = 'JTG';
  public name: string = 'Levincia';
  public fullName: string = 'Levincia JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber = '150';
  public text: string = 'Once during each player\'s turn, that player may put up to 2 Basic [L] Energy cards from their discard pile into their hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;

      let hasCardsInDiscard = false;
      player.discard.cards.forEach((c) => {
        if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.provides.includes(CardType.LIGHTNING)) {
          hasCardsInDiscard = true;
        }
      });

      if (hasCardsInDiscard === false) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Lightning Energy' },
        { allowCancel: false, min: 0, max: 2 }
      ), selected => {
        selected = selected || [];
        player.discard.moveCardsTo(selected, player.hand);
      });
    }

    return state;
  }
}