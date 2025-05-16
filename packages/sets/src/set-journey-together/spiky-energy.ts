import { StoreLike, State, Effect, AfterDamageEffect, CardType, EnergyCard, EnergyType, GamePhase, IS_SPECIAL_ENERGY_BLOCKED, StateUtils } from '@ptcg/common';

export class SpikyEnergy extends EnergyCard {
  public provides: CardType[] = [C];
  public energyType = EnergyType.SPECIAL;
  public regulationMark = 'I';
  public set: string = 'JTG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '159';
  public name = 'Spiky Energy';
  public fullName = 'Spiky Energy JTG';
  public text = `As long as this card is attached to a Pokémon, it provides [C] Energy.

If the Pokémon this card is attached to is in the Active Spot and is damaged by an attack from your opponent's Pokémon (even if this Pokémon is Knocked Out), put 2 damage counters on the Attacking Pokémon.`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AfterDamageEffect && effect.target.cards.includes(this) && state.phase === GamePhase.ATTACK) {
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = effect.player;
      if (player === opponent || player.active !== effect.target)
        return state;

      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.target)) {
        return state;
      }

      effect.source.damage += 20;
    }
    return state;
  }

}
