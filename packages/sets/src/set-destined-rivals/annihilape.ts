import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, Effect, AttackEffect, IS_ABILITY_BLOCKED, WAS_ATTACK_USED, BLOCK_EFFECT_IF_MARKER, ADD_MARKER, REMOVE_MARKER_AT_END_OF_TURN, REPLACE_MARKER_AT_END_OF_TURN } from "@ptcg/common";

export class Annihilape extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Primeape';
  public cardType: CardType = F;
  public hp: number = 150;
  public weakness = [{ type: P }];
  public retreat = [ C, C ];

  public powers = [{
    name: 'Vessel of Rage',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has 2 or more damage counters on it, attacks used by this Pokémon do 120 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Impact Blow',
    cost: [ F, F ],
    damage: 160,
    text: 'During your next turn, this Pokémon can\'t use Impact Blow.'
  }];

  public set: string = 'SV10';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';
  public name: string = 'Annihilape';
  public fullName: string = 'Annihilape SV10';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Vessel of Rage
    if (effect instanceof AttackEffect && effect.source.cards.includes(this)) {
      if (IS_ABILITY_BLOCKED(store, state, effect.player, this)){ return state; }
      
      if (effect.source.damage >= 20){
        effect.damage += 120;
      }
    }

    // Impact Blow
    if (WAS_ATTACK_USED(effect, 0, this)){
      BLOCK_EFFECT_IF_MARKER(this.ATTACK_USED_2_MARKER, effect.player, this);
      ADD_MARKER(this.ATTACK_USED_MARKER, effect.player, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_2_MARKER, this);
    REPLACE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_MARKER, this.ATTACK_USED_2_MARKER, this);
    
    return state;
  }
}
