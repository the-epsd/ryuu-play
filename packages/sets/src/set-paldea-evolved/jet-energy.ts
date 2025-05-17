import { EnergyCard, CardType, EnergyType, StoreLike, State, Effect, AttachEnergyEffect, IS_SPECIAL_ENERGY_BLOCKED } from "@ptcg/common";

export class JetEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '190';

  public regulationMark = 'G';

  public name = 'Jet Energy';

  public fullName = 'Jet Energy PAL';

  public text = 'As long as this card is attached to a Pokémon, it provides [C] Energy.' +
    '' +
    'When you attach this card from your hand to 1 of your Benched Pokémon, switch that Pokémon with your Active Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      const player = effect.player;
      const target = effect.target;

      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.target)) {
        return state;
      }

      player.switchPokemon(target);
    }

    return state;
  }
}