import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, DISCARD_X_ENERGY_FROM_THIS_POKEMON } from "@ptcg/common";

export class EthansCyndaquil extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.ETHANS];
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Ember',
      cost: [R],
      damage: 30,
      text: 'Discard an Energy from this Pokémon.',
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV9a';
  public setNumber: string = '15';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ethan\'s Cyndaquil';
  public fullName: string = 'Ethan\'s Cyndaquil SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }
    return state;
  }

}