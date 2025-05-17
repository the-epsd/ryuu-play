import { PokemonCard, Stage, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, ADD_CONFUSION_TO_PLAYER_ACTIVE } from "@ptcg/common";

export class Gothita extends PokemonCard {
  public regulationMark = 'G';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Pound',
      cost: [ C ],
      damage: 10,
      text: ''
    },
    {
      name: 'Eerie Wave',
      cost: [ P, C ],
      damage: 20,
      text: 'Flip 2 coins. This attack does 10 damage for each heads.'
    },
    
  ];

  public set: string = 'PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '90';
  public name: string = 'Gothita';
  public fullName: string = 'Gothita PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Eerie Wave
    if (WAS_ATTACK_USED(effect, 1, this)){
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }
    
    return state;
  }
}