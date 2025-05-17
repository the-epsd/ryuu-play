import { PokemonCard, Stage, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, COIN_FLIP_PROMPT } from "@ptcg/common";

export class Pawniard extends PokemonCard {
  public regulationMark = 'G';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Triple Cutter',
      cost: [ M ],
      damage: 10,
      damageCalculation: 'x',
      text: 'Flip 3 coins. This attack does 10 damage for each heads.'
    }
  ];

  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '148';
  public name: string = 'Pawniard';
  public fullName: string = 'Pawniard OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)){
      let heads = 0;

      COIN_FLIP_PROMPT(store, state, effect.player, result => { if (result){ heads++; } });
      COIN_FLIP_PROMPT(store, state, effect.player, result => { if (result){ heads++; } });
      COIN_FLIP_PROMPT(store, state, effect.player, result => { if (result){ heads++; } });
      
      effect.damage = heads * 10;
    }
    
    return state;
  }

}
