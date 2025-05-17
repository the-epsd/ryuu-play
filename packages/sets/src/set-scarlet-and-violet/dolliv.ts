import { PokemonCard, Stage, StoreLike, State, Effect, AttackEffect, StateUtils, PutDamageEffect, AbstractAttackEffect, EndTurnEffect, PlayerType } from "@ptcg/common";

export class Dolliv extends PokemonCard {
  public evolvesFrom = 'Smoliv';
  public stage = Stage.STAGE_1;
  public cardType = G;
  public hp = 90;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Slap',
      cost: [C],
      damage: 20,
      text: ''
    }, {
      name: 'Apply Oil',
      cost: [G, C],
      damage: 40,
      text: 'During your opponent\'s next turn, if the Defending Pokémon tries to attack, your opponent flips a coin. If tails, that attack doesn\'t happen.'
    }];

  public regulationMark = 'G';
  public set = 'SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name = 'Dolliv';
  public fullName = 'Dolliv SVI';

  public readonly DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
  public readonly CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';

  reduceEffect(store: StoreLike, state: State, effect: Effect) {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.active.marker.addMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
      console.log('marker added');
    }

    if (effect instanceof PutDamageEffect || effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {
      if (effect.target.marker.hasMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this)) {
        effect.preventDefault = true;
        return state;
      }
    }

    if (effect instanceof EndTurnEffect
      && effect.player.active.marker.hasMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this)) {
      effect.player.active.marker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
      });
      console.log('marker removed');
    }
    return state;
  }
}
