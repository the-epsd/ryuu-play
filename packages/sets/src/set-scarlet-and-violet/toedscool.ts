import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, AddSpecialConditionsEffect, SpecialCondition } from "@ptcg/common";

export class Toedscool extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 60;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Spore',
    cost: [CardType.GRASS],
    damage: 0,
    text: ' Your opponent\'s Active Pokémon is now Asleep.'
  },
  {
    name: 'Ram',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 10,
    text: ''
  }];

  public set: string = 'SVI';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public fullName: string = 'Toedscool SVI';
  public name: string = 'Toedscool';
  public setNumber: string = '25';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }
    return state;
  }
}