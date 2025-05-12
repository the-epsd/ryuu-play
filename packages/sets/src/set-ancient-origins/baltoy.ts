import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, Effect, StateUtils, GameMessage, GameError, CardList, OrderCardsPrompt, SelectPrompt, EffectOfAbilityEffect, WAS_ATTACK_USED } from '@ptcg/common';

export class Baltoy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'θ Stop',
    powerType: PowerType.ANCIENT_TRAIT,
    text: 'Prevent all effects of your opponent\'s Pokémon\'s Abilities done to this Pokémon.'
  }];

  public attacks = [{
    name: 'Future Spin',
    cost: [P],
    damage: 0,
    text: 'Look at the top 3 cards of either player\'s deck and put them back on top of that player\'s deck in any order.'
  }];

  public set: string = 'AOR';
  public name: string = 'Baltoy';
  public fullName: string = 'Baltoy AOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof EffectOfAbilityEffect && effect.target && effect.target?.cards?.includes(this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const targetCard = effect.target.getPokemonCard();

      if (targetCard && targetCard === this && opponent.getPokemonInPlay().includes(effect.target)) {
        effect.target = undefined;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const options: { message: GameMessage, action: () => void }[] = [
        {
          message: GameMessage.ORDER_YOUR_DECK,
          action: () => {

            if (player.deck.cards.length === 0) {
              throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
            }

            const deckTop = new CardList();
            player.deck.moveTo(deckTop, 3);

            return store.prompt(state, new OrderCardsPrompt(
              player.id,
              GameMessage.CHOOSE_CARDS_ORDER,
              deckTop,
              { allowCancel: false },
            ), order => {
              if (order === null) {
                return state;
              }

              deckTop.applyOrder(order);
              deckTop.moveToTopOfDestination(player.deck);

            });

          }
        },
        {
          message: GameMessage.ORDER_OPPONENT_DECK,
          action: () => {
            if (opponent.deck.cards.length === 0) {
              throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
            }

            const deckTop = new CardList();
            opponent.deck.moveTo(deckTop, 3);

            return store.prompt(state, new OrderCardsPrompt(
              player.id,
              GameMessage.CHOOSE_CARDS_ORDER,
              deckTop,
              { allowCancel: false },
            ), order => {
              if (order === null) {
                return state;
              }

              deckTop.applyOrder(order);
              deckTop.moveToTopOfDestination(opponent.deck);

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
