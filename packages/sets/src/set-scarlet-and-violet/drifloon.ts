import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect } from "@ptcg/common";

export class Drifloon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Gust',
    cost: [C, C],
    damage: 10,
    text: ''
  },
  {
    name: 'Balloon Blast',
    cost: [P, P],
    damage: 30,
    damageCalculation: 'x',
    text: 'This attack does 30 damage for each damage counter on this Pokémon.'
  }];

  public regulationMark = 'G';
  public set: string = 'SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '89';
  public name: string = 'Drifloon';
  public fullName: string = 'Drifloon SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const drifloonDamage = effect.player.active.damage;
      const damagePerCounter = 3;

      effect.damage = (drifloonDamage * damagePerCounter);
      return state;
    }
    return state;
  }
}