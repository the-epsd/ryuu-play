import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, Effect, PlayPokemonEffect, StateUtils, PowerEffect, GameMessage, TrainerCard, TrainerType, GameError, Card, ChooseCardsPrompt, SuperType, ShowCardsPrompt, ShuffleDeckPrompt, SelectPrompt } from "@ptcg/common";

export class Pelipper extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Wingull';
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 120;
  public weakness = [{ type: CardType.LIGHTNING }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Hearsay',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may choose 1: put a Supporter card from your discard pile into your hand; or search your deck for a Supporter card, reveal it, put it into your hand, and then shuffle your deck. '
  }];

  public attacks = [{
    name: 'Wing Attack',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 90,
    text: ''
  }];

  public set: string = 'PAL';
  public setNumber: string = '159';
  public regulationMark: string = 'G';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pelipper';
  public fullName: string = 'Pelipper PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // if (player.deck.cards.length === 0) {
      //   return state;
      // }

      // Try to reduce PowerEffect, to check if something is blocking our ability
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

      const options: { message: GameMessage, action: () => void }[] = [
        {
          message: GameMessage.CHOOSE_SUPPORTER_FROM_DISCARD,
          action: () => {

            const hasSupporter = player.discard.cards.some(c => {
              return c instanceof TrainerCard && c.trainerType === TrainerType.SUPPORTER;
            });

            if (!hasSupporter) {
              throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
            }

            let cards: Card[] = [];
            return store.prompt(state, new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_CARD_TO_HAND,
              player.discard,
              { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
              { min: 1, max: 1, allowCancel: true }
            ), selected => {
              cards = selected || [];
              if (cards.length > 0) {
                store.prompt(state, [new ShowCardsPrompt(
                  opponent.id,
                  GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
                  cards
                )], () => {
                  player.discard.moveCardsTo(cards, player.hand);
                });
              }

              return state;
            });
          }
        },
        {
          message: GameMessage.CHOOSE_SUPPORTER_FROM_DECK,
          action: () => {

            return store.prompt(state, new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_CARD_TO_HAND,
              player.deck,
              { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
              { min: 0, max: 1, allowCancel: false }
            ), selected => {
              const cards = selected || [];

              store.prompt(state, [new ShowCardsPrompt(
                opponent.id,
                GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
                cards
              )], () => {
                player.deck.moveCardsTo(cards, player.hand);
              });
              return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
              });
            });

          }
        }
      ];

      return store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.CHOOSE_OPTION,
        options.map(opt => opt.message),
        { allowCancel: false }
      ), choice => {
        const option = options[choice];
        option.action();
      });

    }

    return state;
  }
}