import { TrainerCard, TrainerType, StoreLike, State, Effect, TrainerEffect, StateUtils, GameError, GameMessage, PokemonCard, Stage, CardTag, CoinFlipPrompt, Card, ChooseCardsPrompt, SuperType, ShuffleDeckPrompt, GameLog, ShowCardsPrompt } from "@ptcg/common";

export class TeamRocketsGreatBall extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'SV10';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '88';

  public regulationMark = 'I';

  public name: string = 'Team Rocket\'s Great Ball';

  public fullName: string = 'Team Rocket\'s Great Ball SV10';

  public text: string = 'Flip a coin. If heads, search your deck for an Evolution Team Rocket Pokémon, reveal it, and put it into your hand. If tails, search your deck for a Basic Team Rocket Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard &&
          ((card.stage === Stage.BASIC) || !card.tags.includes(CardTag.TEAM_ROCKET))) {
          blocked.push(index);
        }
      });

      const blocked2: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard &&
          ((card.stage !== Stage.BASIC) || !card.tags.includes(CardTag.TEAM_ROCKET))) {
          blocked2.push(index);
        }
      });

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), flipResult => {
        if (flipResult) {
          let cards: Card[] = [];
          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_HAND,
            player.deck,
            { superType: SuperType.POKEMON },
            { min: 0, max: 1, allowCancel: false, blocked }
          ), selectedCards => {
            cards = selectedCards || [];

            // Operation canceled by the user
            if (cards.length === 0) {
              player.supporter.moveCardTo(this, player.discard);
              return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
              });
            }

            cards.forEach((card, index) => {
              store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
            });


            if (cards.length > 0) {
              player.supporter.moveCardTo(this, player.discard);
              state = store.prompt(state, new ShowCardsPrompt(
                opponent.id,
                GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
                cards), () => state);
            }

            cards.forEach(card => {
              player.deck.moveCardTo(card, player.hand);
            });
            return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
              player.deck.applyOrder(order);
            });
          });
        }
        if (!flipResult) {
          let cards: Card[] = [];
          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_HAND,
            player.deck,
            { superType: SuperType.POKEMON, stage: Stage.BASIC },
            { min: 0, max: 1, allowCancel: false, blocked: blocked2 }
          ), selectedCards => {
            cards = selectedCards || [];

            // Operation canceled by the user
            if (cards.length === 0) {
              player.supporter.moveCardTo(this, player.discard);
              return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
              });
            }

            cards.forEach((card, index) => {
              store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
            });

            if (cards.length > 0) {
              player.supporter.moveCardTo(this, player.discard);
              state = store.prompt(state, new ShowCardsPrompt(
                opponent.id,
                GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
                cards), () => state);
            }
            cards.forEach(card => {
              player.deck.moveCardTo(card, player.hand);
            });
            return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
              player.deck.applyOrder(order);
            });
          });
        }
        return state;
      });
    }
    return state;
  }
}