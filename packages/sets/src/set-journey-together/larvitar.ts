import { StoreLike, State, Effect, AttackEffect, Card, CardType, ChooseCardsPrompt, CoinFlipPrompt, DiscardCardsEffect, EnergyCard, GameMessage, PokemonCard, Stage, StateUtils, SuperType } from '@ptcg/common';

export class Larvitar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Crunch',
      cost: [C, C],
      damage: 20,
      text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
    }
  ];

  public set: string = 'JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '80';
  public name: string = 'Larvitar';
  public fullName: string = 'Larvitar JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {

          // Defending Pokemon has no energy cards attached
          if (!opponent.active.cards.some(c => c instanceof EnergyCard)) {
            return state;
          }

          let cards: Card[] = [];
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            opponent.active,
            { superType: SuperType.ENERGY },
            { min: 1, max: 1, allowCancel: true }
          ), selected => {
            cards = selected || [];
            const discardEnergy = new DiscardCardsEffect(effect, cards);
            return store.reduceEffect(state, discardEnergy);
          });

        }
      });
    }

    return state;
  }

}