import { PokemonCard, Stage, CardType, Weakness, Attack, StoreLike, State, Effect, WAS_ATTACK_USED, ATTACH_ENERGY_PROMPT, PlayerType, SlotType, EnergyType, HEAL_X_DAMAGE_FROM_THIS_POKEMON } from "@ptcg/common";

export class WellspringMaskOgerpon extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 110;
  public weakness: Weakness[] = [{ type: L }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    {
      name: 'Water Dance',
      cost: [C],
      damage: 0,
      text: 'Search your deck for a Basic [W] Energy card and attach it to 1 of your Pokémon. Then, shuffle your deck.'
    },
    {
      name: 'Bubble Drain',
      cost: [W, W, C],
      damage: 100,
      text: 'Heal 30 damage from this Pokémon.'
    },
  ];

  public set: string = 'SV9a';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Wellspring Mask Ogerpon';
  public fullName: string = 'Wellspring Mask Ogerpon SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return ATTACH_ENERGY_PROMPT(
        store, state, player, PlayerType.BOTTOM_PLAYER, SlotType.DECK, [SlotType.ACTIVE, SlotType.BENCH],
        { energyType: EnergyType.BASIC, name: 'Water Energy' },
        { min: 0, max: 1, allowCancel: false },
      );
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
    }

    return state;
  }
}