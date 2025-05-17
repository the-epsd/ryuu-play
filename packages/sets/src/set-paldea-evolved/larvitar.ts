import { PokemonCard, Stage, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, COIN_FLIP_PROMPT } from "@ptcg/common";

export class Larvitar extends PokemonCard {
  public regulationMark = 'G';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Double Stab',
      cost: [ C ],
      damage: 10,
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 10 damage for each heads.'
    }
  ];

  public set: string = 'PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '110';
  public name: string = 'Larvitar';
  public fullName: string = 'Larvitar PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)){
      let heads = 0;

      COIN_FLIP_PROMPT(store, state, effect.player, result => { if (result){ heads++; } });
      COIN_FLIP_PROMPT(store, state, effect.player, result => { if (result){ heads++; } });
      
      effect.damage = heads * 10;
    }
    
    return state;
  }

}
