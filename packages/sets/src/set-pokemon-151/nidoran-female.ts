import { PokemonCard, Stage, CardType, StoreLike, State, AttackEffect, AddSpecialConditionsEffect, SpecialCondition } from "@ptcg/common";

export class NidoranFemale extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.DARK;
  public hp: number = 60;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Poison Horn',
      cost: [CardType.DARK, CardType.COLORLESS],
      damage: 20,
      text: 'Your opponent\'s Active Pokémon is now Poisoned.'
    }
  ];

  public set: string = 'MEW';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '29';
  public name: string = 'Nidoran F';
  public fullName: string = 'Nidoran F MEW';

  public reduceEffect(store: StoreLike, state: State, effect: AttackEffect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      return store.reduceEffect(state, specialCondition);
    }
    return state;
  }
}
