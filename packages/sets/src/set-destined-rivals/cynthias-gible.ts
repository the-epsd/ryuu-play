import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, Effect, AttackEffect } from "@ptcg/common";

export class CynthiasGible extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.CYNTHIAS];
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Rock Hurl',
      cost: [F],
      damage: 20,
      text: 'This attack\'s damage isn\'t affected by Resistance.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV9a';
  public setNumber: string = '42';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cynthia\'s Gible';
  public fullName: string = 'Cynthia\'s Gible SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.ignoreResistance = true;
    }
    return state;
  }
}