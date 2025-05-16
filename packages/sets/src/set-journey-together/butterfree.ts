import { StoreLike, State, Effect, ADD_PARALYZED_TO_PLAYER_ACTIVE, CardType, CoinFlipPrompt, GameMessage, PokemonCard, Stage, WAS_ATTACK_USED } from '@ptcg/common';

export class Butterfree extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Metapod';
  public cardType: CardType = C;
  public hp: number = 120;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Scale Hurricane',
      cost: [G],
      damage: 60,
      damageCalculation: '+',
      text: 'Flip 4 coins. This attack does 60 damage for each heads. If at least 2 of them are heads, your opponent\'s Active Pokémon is now Paralyzed.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'JTG';
  public name: string = 'Butterfree';
  public fullName: string = 'Butterfree JTG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 60 * heads;

        if (heads >= 2) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
      return state;
    }
    return state;
  }
}