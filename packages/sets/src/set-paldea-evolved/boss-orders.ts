import { StoreLike, State, TrainerEffect, StateUtils, GameError, GameMessage, ChoosePokemonPrompt, PlayerType, SlotType, TrainerTargetEffect, TrainerCard, TrainerType, Effect } from "@ptcg/common";

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const hasBench = opponent.bench.some(b => b.cards.length > 0);
  const supporterTurn = player.supporterTurn;

  if (!hasBench) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  return store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_SWITCH,
    PlayerType.TOP_PLAYER,
    [SlotType.BENCH],
    { allowCancel: false }
  ), result => {
    const cardList = result[0];

    if (cardList) {
      const targetCard = new TrainerTargetEffect(player, effect.trainerCard, cardList);
      targetCard.target = cardList;
      store.reduceEffect(state, targetCard);
      if (targetCard.target) {
        opponent.switchPokemon(targetCard.target);
      }
    }

    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
  });
}


export class BossOrders extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '172';

  public name: string = 'Boss\'s Orders';

  public fullName: string = 'Boss\'s Orders PAL';

  public text: string =
    'Switch 1 of your opponent\'s Benched Pokemon with his or her ' +
    'Active Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }

}
