import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, CoinFlipPrompt, GameMessage } from "@ptcg/common";

export class Deino extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.DARK;
  public hp: number = 70;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Ambush',
    cost: [CardType.DARK, CardType.COLORLESS],
    damage: 20,
    text: 'Flip a coin. If heads, this attack does 20 more damage.'
  }];

  public set = 'PAL';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '138';
  public name = 'Deino';
  public fullName = 'Deino PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          effect.damage += 20;
        }
      });
    }

    return state;
  }
}