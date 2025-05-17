import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, StateUtils, EnergyCard, Card, ChooseCardsPrompt, GameMessage, SuperType, DiscardCardsEffect } from "@ptcg/common";

export class MarniesScraggy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.MARNIES];
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Crunch',
    cost: [D, D, C],
    damage: 50,
    text: 'Discard an Energy from your opponent\'s Active Pokémon.'
  }];

  public regulationMark = 'I';
  public set: string = 'SVOM';
  public setNumber = '3';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Marnie\'s Scraggy';
  public fullName: string = 'Marnie\'s Scraggy SVOM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // If defending Pokemon has no energy cards attached, return early
      if (!opponent.active.cards.some(c => c instanceof EnergyCard)) {
        return state;
      }

      let card: Card;
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.active,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        card = selected[0];
        return store.reduceEffect(state, new DiscardCardsEffect(effect, [card]));
      });
    }
    return state;
  }
}
