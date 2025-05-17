import { TrainerCard, TrainerType, StoreLike, State, Effect, TrainerEffect, GameError, GameMessage, CardTarget, PlayerType, Stage, ChoosePokemonPrompt, SlotType, PokemonCard, MOVE_CARDS, MOVE_CARD_TO } from "@ptcg/common";

export class Penny extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'G';

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '183';

  public name: string = 'Penny';

  public fullName: string = 'Penny SVI';

  public text: string =
    'Put 1 of your Basic Pokémon and all attached cards into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      let hasBasicPokemon: boolean = false;
      const blocked: CardTarget[] = [];

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (card.stage === Stage.BASIC) {
          hasBasicPokemon = true;
          return;
        }
        blocked.push(target);
      });

      if (!hasBasicPokemon) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false, blocked }
      ), result => {
        const cardList = result.length > 0 ? result[0] : null;
        if (cardList !== null) {
          const pokemons = cardList.getPokemons();
          const otherCards = cardList.cards.filter(card => !(card instanceof PokemonCard)); // Ensure only non-PokemonCard types

          // Move other cards to hand
          if (otherCards.length > 0) {
            MOVE_CARDS(store, state, cardList, player.hand, { cards: otherCards });
          }

          // Move Pokémon to hand
          if (pokemons.length > 0) {
            MOVE_CARDS(store, state, cardList, player.hand, { cards: pokemons });
          }
          MOVE_CARD_TO(state, effect.trainerCard, player.discard);
        }
      });
    }
    return state;
  }
}
