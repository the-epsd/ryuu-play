import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, CoinFlipPrompt, GameMessage } from "@ptcg/common";

export class Naclstack extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Nacli';
  public cardType: CardType = F;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Salt Cannon',
    cost: [F, F],
    damage: 60,
    damageCalculation: 'x',
    text: 'Flip 3 coins. This attack does 60 damage for each heads.'
  }];

  public set: string = 'PAL';
  public name: string = 'Naclstack';
  public fullName: string = 'Naclstack PAL';
  public setNumber: string = '122';
  public regulationMark: string = 'G';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Salt Cannon
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 60 * heads;
      });
    }
    
    return state;
  }
}