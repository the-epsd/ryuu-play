import { StoreLike, State, TrainerEffect, StateUtils, GameError, GameMessage, CoinFlipPrompt, ChoosePokemonPrompt, PlayerType, SlotType, TrainerCard, TrainerType, Effect } from "@ptcg/common";

function* playCard(next: Function, store: StoreLike, state: State, self: PokemonCatcher, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const hasBench = opponent.bench.some(b => b.cards.length > 0);

  if (!hasBench) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  let coinResult: boolean = false;
  yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
    coinResult = result;
    next();
  });

  if (coinResult === false) {
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
  }

  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_SWITCH,
    PlayerType.TOP_PLAYER,
    [SlotType.BENCH],
    { allowCancel: false }
  ), result => {
    const cardList = result[0];
    opponent.switchPokemon(cardList);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
  });

  player.supporter.moveCardTo(effect.trainerCard, player.discard);
}

export class PokemonCatcher extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '187';

  public name: string = 'Pokémon Catcher';

  public fullName: string = 'Pokémon Catcher SVI';

  public text: string =
    'Flip a coin. If heads, switch 1 of your opponent\'s Benched Pokemon ' +
    'with their Active Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }

}
