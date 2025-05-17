import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, CoinFlipPrompt, GameMessage } from "@ptcg/common";

export class Dragonair extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Dratini';

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 100;

  public weakness = [];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Ram',
    cost: [CardType.COLORLESS],
    damage: 30,
    text: ''
  }, {
    name: 'Dragon Tail',
    cost: [CardType.WATER, CardType.LIGHTNING],
    damage: 70,
    damageCalculator: 'x',
    text: 'Flip 2 coins. This attack does 70 damage for each heads.'
  }];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '158';

  public name: string = 'Dragonair';

  public fullName: string = 'Dragonair OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 70 * heads;
      });
    }

    return state;
  }

}
