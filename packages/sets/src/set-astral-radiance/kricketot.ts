import { StoreLike, State, Effect, AttackEffect, CardType, CoinFlipPrompt, GameMessage, PokemonCard, Stage } from '@ptcg/common';

export class Kricketot extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 60;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Trip Over',
    cost: [CardType.GRASS],
    damage: 10,
    text: 'Flip a coin. If heads, this attack does 20 more damage.'
  }];

  public regulationMark: string = 'F';
  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '9';
  public name: string = 'Kricketot';
  public fullName: string = 'Kricketot ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return store.prompt(state, new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP), flipResult => {
        if (flipResult) {
          effect.damage += 20;
        }
        return state;
      });
    }
    return state;
  }
}
