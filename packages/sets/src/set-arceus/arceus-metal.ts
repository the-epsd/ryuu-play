import { PokemonCard, Stage, CardType, CardTag, PowerType, StoreLike, State, Effect, WAS_ATTACK_USED, PutDamageEffect, DealDamageEffect, PutCountersEffect, AddSpecialConditionsEffect, GamePhase } from '@ptcg/common';

export class ArceusMetal extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];
  public tags = [CardTag.ARCEUS];

  public powers = [{
    name: 'Arceus Rule',
    powerType: PowerType.ARCEUS_RULE,
    text: 'You may have as many of this card in your deck as you like.'
  }];

  public attacks = [
    {
      name: 'Metal Barrier',
      cost: [M, C, C],
      damage: 40,
      text: 'Prevent all effects of attacks, including damage, done to Arceus by Pokémon LV.X during your opponent\'s next turn.'
    }
  ];

  public set: string = 'AR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'AR9';
  public name: string = 'Arceus';
  public fullName: string = 'Arceus Metal AR';

  public readonly METAL_BARRIER_MARKER = 'METAL_BARRIER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Metal Barrier
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.opponent.marker.addMarker(this.METAL_BARRIER_MARKER, this);
    }

    if ((effect instanceof PutDamageEffect
      || effect instanceof DealDamageEffect
      || effect instanceof PutCountersEffect
      || effect instanceof AddSpecialConditionsEffect)
      && effect.player.marker.hasMarker(this.METAL_BARRIER_MARKER, this)
      && effect.target.getPokemonCard() === this) {
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      effect.preventDefault = true;
    }

    return state;
  }
}