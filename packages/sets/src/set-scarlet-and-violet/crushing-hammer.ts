import { StoreLike, State, TrainerEffect, StateUtils, CardTarget, PlayerType, SuperType, GameError, GameMessage, CoinFlipPrompt, PokemonCardList, ChoosePokemonPrompt, SlotType, Card, ChooseCardsPrompt, TrainerCard, TrainerType, Effect, MOVE_CARDS, MOVE_CARD_TO } from "@ptcg/common";

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  let hasPokemonWithEnergy = false;
  const blocked: CardTarget[] = [];
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    if (cardList.cards.some(c => c.superType === SuperType.ENERGY)) {
      hasPokemonWithEnergy = true;
    } else {
      blocked.push(target);
    }
  });

  if (!hasPokemonWithEnergy) {
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

  let targets: PokemonCardList[] = [];
  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
    PlayerType.TOP_PLAYER,
    [SlotType.ACTIVE, SlotType.BENCH],
    { allowCancel: false, blocked }
  ), results => {
    targets = results || [];
    next();
  });

  if (targets.length === 0) {
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
  }

  const target = targets[0];
  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    target,
    { superType: SuperType.ENERGY },
    { min: 1, max: 1, allowCancel: false }
  ), selected => {
    cards = selected;
    next();
  });

  // Move selected energy cards to discard
  if (cards.length > 0) {
    MOVE_CARDS(store, state, target, opponent.discard, { cards });
  }
  // Move the trainer card to discard
  MOVE_CARD_TO(state, effect.trainerCard, player.discard);

  return state;
}

export class CrushingHammer extends TrainerCard {
  public regulationMark = 'G';
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '168';
  public name: string = 'Crushing Hammer';
  public fullName: string = 'Crushing Hammer SVI';
  public text: string = 'Flip a coin. If heads, discard an Energy attached to 1 of your opponent\'s Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
}