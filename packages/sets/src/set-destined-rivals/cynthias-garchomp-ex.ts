import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, Effect, AttackEffect, CONFIRMATION_PROMPT, DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND, GameMessage, CheckProvidedEnergyEffect, Card, DiscardCardsEffect } from "@ptcg/common";

export class CynthiasGarchompex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Cynthia\'s Gabite';
  public tags = [CardTag.CYNTHIAS, CardTag.POKEMON_ex];
  public cardType: CardType = F;
  public hp: number = 330;
  public weakness = [{ type: G }];
  public retreat = [];

  public attacks = [
    {
      name: 'Corkscrew Dive',
      cost: [F],
      damage: 100,
      text: 'You may draw cards until you have 6 cards in your hand.'
    },
    {
      name: 'Draconic Buster',
      cost: [F, F],
      damage: 260,
      text: 'Discard all Energy from this Pokémon.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV9a';
  public setNumber: string = '44';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cynthia\'s Garchomp ex';
  public fullName: string = 'Cynthia\'s Garchomp ex SV9a';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.hand.cards.length >= 6 || player.deck.cards.length === 0) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, (result) => {
        if (result) {
          DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND(6, effect, state);
        }
      }, GameMessage.WANT_TO_DRAW_UNTIL_6);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const cards: Card[] = checkProvidedEnergy.energyMap.map(e => e.card);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);
    }

    return state;
  }
}
