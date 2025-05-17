import { PokemonCard, Stage, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, COIN_FLIP_PROMPT } from "@ptcg/common";

export class Mankey extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Wild Kick',
      cost: [ C ],
      damage: 30,
      text: 'Flip a coin. If tails, this attack does nothing.'
    }
  ];

  public set: string = 'SV10';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public name: string = 'Mankey';
  public fullName: string = 'Mankey SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)){
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result){ effect.damage = 0; }
      });
    }
    
    return state;
  }
}
