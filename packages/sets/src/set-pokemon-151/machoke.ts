import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, StateUtils } from "@ptcg/common";

export class Machoke extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Machop';
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 100;
  public weakness = [{ type: CardType.PSYCHIC }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Mountain RAMMING',
      cost: [CardType.FIGHTING, CardType.FIGHTING],
      damage: 50,
      text: 'Discard the top card of your opponent\'s deck.'
    }
  ];

  public regulationMark: string = 'G';
  public set: string = 'MEW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';
  public name: string = 'Machoke';
  public fullName: string = 'Machoke MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.deck.cards.length > 0) {
        opponent.deck.moveCardTo(opponent.deck.cards[0], opponent.discard);
      }
    }
    return state;
  }
}
