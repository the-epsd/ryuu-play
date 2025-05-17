import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from "@ptcg/common";

export class CynthiasMilotic extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.CYNTHIAS];
  public cardType: CardType = W;
  public hp: number = 130;
  public weakness = [{ type: L }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Aqua Split',
      cost: [W, C],
      damage: 60,
      text: 'This attack also does 30 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV9a';
  public setNumber: string = '29';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cynthia\'s Milotic';
  public fullName: string = 'Cynthia\'s Milotic SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Aqua Split
    if (WAS_ATTACK_USED(effect, 0, this)){
      THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_BENCHED_POKEMON(30, effect, store, state, 1, 2);
    }

    return state;
  }
}