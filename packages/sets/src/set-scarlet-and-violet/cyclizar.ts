import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, MOVE_CARDS } from "@ptcg/common";

export class Cyclizar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 110;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [{
    name: 'Touring',
    cost: [C],
    damage: 0,
    text: 'Draw 2 cards.'
  },
  {
    name: 'Speed Attack',
    cost: [C, C, C],
    damage: 100,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '164';
  public name: string = 'Cyclizar';
  public fullName: string = 'Cyclizar SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      MOVE_CARDS(store, state, player.deck, player.hand, { count: 2 });
    }
    return state;
  }
}