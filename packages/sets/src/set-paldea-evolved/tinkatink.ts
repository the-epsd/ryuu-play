import { StoreLike, State, AttackEffect, TrainerCard, TrainerType, GameError, GameMessage, Card, ChooseCardsPrompt, SuperType, PokemonCard, Stage, CardType, Effect } from "@ptcg/common";

function* useScrapPickup(next: Function, store: StoreLike, state: State, self: Tinkatink, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  const hasItem = player.discard.cards.some(c => {
    return c instanceof TrainerCard && c.trainerType === TrainerType.ITEM;
  });

  if (!hasItem) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.discard,
    { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM },
    { min: 1, max: 1, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length > 0) {
    player.hand.moveCardTo(self, player.discard);
    player.discard.moveCardsTo(cards, player.hand);
  }

  return state;
}

export class Tinkatink extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 60;
  public weakness = [{ type: CardType.METAL }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Scrap Pickup',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Put an Item card from your discard pile into your hand.'
  },
  {
    name: 'Fairy Wind',
    cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
    damage: 30,
    text: ''
  }];

  public regulationMark: string = 'G';
  public set: string = 'PAL';
  public name: string = 'Tinkatink';
  public fullName: string = 'Tinkatink PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if(effect instanceof AttackEffect && effect.attack == this.attacks[0]){
      const generator = useScrapPickup(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }

}