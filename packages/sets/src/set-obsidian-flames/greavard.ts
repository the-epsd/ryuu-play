import { PokemonCard, Stage, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, COIN_FLIP_PROMPT } from "@ptcg/common";

export class Greavard extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Play Rough',
      cost: [C, C, C],
      damage: 30,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 30 more damage.'
    }
  ];

  public regulationMark = 'G';
  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '100';
  public name: string = 'Greavard';
  public fullName: string = 'Greavard OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result){
          effect.damage += 30;
        }
      });
    }

    return state;
  }

}
