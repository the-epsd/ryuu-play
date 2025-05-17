import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, Effect, PlayPokemonEffect, StateUtils, PowerEffect, ConfirmPrompt, GameMessage, ChooseCardsPrompt, SuperType, ShowCardsPrompt, ShuffleDeckPrompt, AttackEffect } from "@ptcg/common";

export class Flamigo extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 110;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Insta-Flock',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokemon from your hand onto your ' +
      'Bench during your turn, you may search your deck for up ' +
      'to 3 Flamigo, reveal them, and put them into your hand.' +
      'Then, shuffle your deck.'
  }];

  public attacks = [

    {
      name: 'United Wings',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      damageCalculation: 'x',
      text: 'This attack does 20 damage for each Pokémon in your ' +
        'in your discard pile that have the United Wings attack.'
    }
  ];

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '170';

  public name: string = 'Flamigo';

  public fullName: string = 'Flamigo PAL';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (player.deck.cards.length === 0) {
        return state;
      }

      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }
      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {

          state = store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_HAND,
            player.deck,
            { superType: SuperType.POKEMON, stage: Stage.BASIC, name: 'Flamigo' },
            { min: 0, max: 3, allowCancel: false }
          ), selected => {
            const cards = selected || [];
            player.deck.moveCardsTo(cards, player.hand);

            if (cards.length > 0) {
              state = store.prompt(state, new ShowCardsPrompt(
                opponent.id,
                GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
                cards), () => state);
            }
          });

          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
          });
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let pokemonCount = 0;
      player.discard.cards.forEach(c => {
        if (c instanceof PokemonCard && c.attacks.some(a => a.name === 'United Wings')) {
          pokemonCount += 1;
        }
      });

      effect.damage = pokemonCount * 20;
    }

    return state;
  }

}