import { StoreLike, State, Effect, AddSpecialConditionsEffect, Card, CardTag, CheckProvidedEnergyEffect, ChooseCardsPrompt, GameMessage, MOVE_CARDS, PokemonCard, SpecialCondition, Stage, StateUtils, SuperType, WAS_ATTACK_USED } from '@ptcg/common';

export class LuxrayV extends PokemonCard {

  public cardType = L;

  public tags = [CardTag.POKEMON_V];

  public stage = Stage.BASIC;

  public hp = 210;

  public weakness = [{ type: F }];

  public resistance = [];

  public retreat = [C];

  public attacks = [
    {
      name: 'Fang Snipe',
      cost: [C, C],
      damage: 30,
      text: 'Your opponent reveals their hand. Discard a Trainer card you find there.'
    },
    {
      name: 'Radiating Pulse',
      cost: [L, L, C],
      damage: 120,
      text: 'Discard 2 Energy from this Pokémon. Your opponent\'s Active Pokémon is now Paralyzed.'
    }
  ];

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '50';

  public name: string = 'Luxray V';

  public fullName: string = 'Luxray V ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let cards: Card[] = [];
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.hand,
        { superType: SuperType.TRAINER },
        { min: 0, max: 1, allowCancel: false }
      ), selected => {
        cards = selected || [];
        // Operation canceled by the user
        if (cards.length === 0) {
          return state;
        }
        MOVE_CARDS(store, state, opponent.hand, opponent.discard, { cards });
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      state = store.reduceEffect(state, checkProvidedEnergy);

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.active,
        { superType: SuperType.ENERGY },
        { min: 2, max: 2, allowCancel: false }
      ), selected => {
        selected = selected || [];

        player.active.moveCardsTo(selected, player.discard);
      });

      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
      store.reduceEffect(state, specialConditionEffect);

      return state;
    }
    return state;
  }
}
