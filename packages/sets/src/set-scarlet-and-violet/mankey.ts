import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, DealDamageEffect } from "@ptcg/common";

export class Mankey extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 60;
  public weakness = [{ type: CardType.PSYCHIC }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Monkey Beatdown',
      cost: [CardType.FIGHTING],
      damage: 30,
      text: 'This Pokemon also does 10 damage to itself.'
    }
  ];

  public regulationMark: string = 'G';
  public set: string = 'SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '107';
  public name: string = 'Mankey';
  public fullName: string = 'Mankey SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 10);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }
    
    return state;
  }
}
