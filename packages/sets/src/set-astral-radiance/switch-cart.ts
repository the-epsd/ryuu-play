import { StoreLike, State, Effect, ChoosePokemonPrompt, GameError, GameMessage, HealEffect, PlayerType, PokemonCardList, SlotType, Stage, TrainerCard, TrainerEffect, TrainerType } from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const hasBench = player.bench.some(b => b.cards.length > 0);

  if (hasBench === false) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Do not discard the card yet
  effect.preventDefault = true;
  player.hand.moveCardTo(effect.trainerCard, player.supporter);

  const pokemonCard = player.active.getPokemonCard();

  if (pokemonCard && pokemonCard.stage !== Stage.BASIC) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (pokemonCard && pokemonCard.stage === Stage.BASIC) {

    let targets: PokemonCardList[] = [];
    yield store.prompt(state, new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_SWITCH,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.BENCH],
      { allowCancel: false }
    ), results => {
      targets = results || [];
      next();
    });

    if (targets.length === 0) {
      return state;
    }

    // Discard trainer only when user selected a Pokemon
    const healEffect = new HealEffect(player, player.active, 30);
    store.reduceEffect(state, healEffect);
    player.active.clearEffects();
    player.switchPokemon(targets[0]);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
  }
  return state;
}
export class SwitchCart extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '154';

  public name: string = 'Switch Cart';

  public fullName: string = 'Switch Cart ASR';

  public text: string =
    'Switch your Active Basic Pokémon with 1 of your Benched Pokémon. If you do, heal 30 damage from the Pokémon you moved to your Bench.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }

}
