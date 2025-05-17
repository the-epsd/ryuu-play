import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect } from "@ptcg/common";

export class Oddish extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 60;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Feelin\' Fine',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Draw a card.'
  },
  {
    name: 'Stampede',
    cost: [CardType.GRASS],
    damage: 10,
    text: ''
  }];

  public set = 'OBF';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name = 'Oddish';
  public fullName = 'Oddish OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      player.deck.moveTo(player.hand, 1);
    }

    return state;
  }
}