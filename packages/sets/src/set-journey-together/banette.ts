import { StoreLike, State, Effect, AttackEffect, CardType, ChooseCardsPrompt, GameMessage, PokemonCard, ShuffleDeckPrompt, Stage, StateUtils } from '@ptcg/common';

export class Banette extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Shuppet';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Cursed Words',
      cost: [P],
      damage: 0,
      text: 'Your opponent chooses 3 cards from their hand and shuffles those cards into their deck.'
    },
    {
      name: 'Spooky Shot',
      cost: [P, C],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '60';
  public name: string = 'Banette';
  public fullName: string = 'Banette JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Cursed Speech
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.hand.cards.length === 0) {
        return state;
      }

      const cardsToShuffle = Math.min(3, opponent.hand.cards.length);

      state = store.prompt(state, new ChooseCardsPrompt(
        opponent,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.hand,
        {},
        { allowCancel: false, min: cardsToShuffle, max: cardsToShuffle }
      ), cards => {
        cards = cards || [];
        opponent.hand.moveCardsTo(cards, opponent.deck);
      });

      return store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
        opponent.deck.applyOrder(order);
      });
    }

    return state;
  }

}