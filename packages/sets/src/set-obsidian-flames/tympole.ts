import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, StateUtils, EnergyCard, CoinFlipPrompt, GameMessage, Card, ChooseCardsPrompt, SuperType, DiscardCardsEffect } from "@ptcg/common";

export class Tympole extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 70;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Screw Tail',
      cost: [CardType.WATER],
      damage: 10,
      text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
    }
  ];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '50';

  public name: string = 'Tympole';

  public fullName: string = 'Tympole OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Defending Pokemon has no energy cards attached
      if (!opponent.active.cards.some(c => c instanceof EnergyCard)) {
        return state;
      }

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {

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
      });
    }

    return state;
  }
}
