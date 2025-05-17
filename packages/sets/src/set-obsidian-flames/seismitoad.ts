import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, Effect, CheckAttackCostEffect, StateUtils, PowerEffect, AttackEffect, BeginTurnEffect, EndTurnEffect } from "@ptcg/common";

export class Seismitoad extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom: string = 'Palpitoad';

  public cardType: CardType = CardType.WATER;

  public hp: number = 170;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Quaking Zone',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, attacks used by your opponent\'s Active Pokémon cost [C] more.'
  }];

  public attacks = [{
    name: 'Echoed Voice',
    cost: [CardType.WATER, CardType.WATER],
    damage: 120,
    text: 'During your next turn, this Pokémon\'s Echoed Voice attack does 100 more damage (before applying Weakness and Resistance).'
  }];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '52';

  public name: string = 'Seismitoad';

  public fullName: string = 'Seismitoad OBF';

  public readonly NEXT_TURN_MORE_DAMAGE_MARKER = 'NEXT_TURN_MORE_DAMAGE_MARKER';
  public readonly NEXT_TURN_MORE_DAMAGE_MARKER_2 = 'NEXT_TURN_MORE_DAMAGE_MARKER_2';

  public usedAttack: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect &&
      StateUtils.getOpponent(state, effect.player).active.cards.includes(this)) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      try {
        const stub = new PowerEffect(opponent, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard) {
        effect.cost.push(CardType.COLORLESS);
        return state;
      }

      return state;
    }

    if (effect instanceof AttackEffect) {
      this.usedAttack = true;
    }

    if (effect instanceof BeginTurnEffect) {
      if (this.usedAttack) {
        this.usedAttack = false;
      }
    }

    if (effect instanceof EndTurnEffect) {
      if (!this.usedAttack) {
        this.usedAttack = false;
        effect.player.marker.removeMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this);
        effect.player.marker.removeMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, this);
      }
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this)) {
      effect.player.marker.addMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      // Check marker
      if (effect.player.marker.hasMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this)) {
        effect.damage += 100;
      }
      effect.player.marker.addMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this);
    }
    return state;
  }
}