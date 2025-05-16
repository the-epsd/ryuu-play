import { StoreLike, State, Effect, AttackEffect, Card, CardTag, CardType, ChooseCardsPrompt, GameMessage, PokemonCard, Stage, StateUtils } from '@ptcg/common';

export class NsPurrloin extends PokemonCard {
  public tags = [CardTag.NS];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Pilfer',
    cost: [D, C],
    damage: 30,
    text: 'Your opponent reveals their hand. Put a card you find there on the bottom of their deck.'
  }];

  public set: string = 'JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';
  public name: string = 'N\'s Purrloin';
  public fullName: string = 'N\'s Purrloin JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Opponent has no cards in the hand
      if (opponent.hand.cards.length === 0) {
        return state;
      }

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DECK,
        opponent.hand,
        {},
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        cards = selected || [];
        opponent.hand.moveCardsTo(cards, opponent.deck);
      });
    }

    return state;
  }

}