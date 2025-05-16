import { StoreLike, State, Effect, AttackEffect, CardType, DealDamageEffect, EndTurnEffect, PlayerType, PokemonCard, Stage, StateUtils } from '@ptcg/common';

export class Shelgon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Bagon';
  public cardType: CardType = N;
  public hp: number = 100;
  public retreat = [C, C];

  public attacks = [{
      name: 'Guard Press',
      cost: [C, C],
      damage: 30,
      text: 'During your opponent\'s next turn, this Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).'
    },
    {
      name: 'Heavy Impact',
      cost: [R, W, C],
      damage: 80,
      text: ''
    }];

  public set: string = 'JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '113';
  public name: string = 'Shelgon';
  public fullName: string = 'Shelgon JTG';

  public readonly GUARD_PRESS = 'GUARD_PRESS';
  public readonly CLEAR_GUARD_PRESS = 'CLEAR_GUARD_PRESS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.active.marker.addMarker(this.GUARD_PRESS, this);
      opponent.marker.addMarker(this.CLEAR_GUARD_PRESS, this);
    }

    if (effect instanceof DealDamageEffect && effect.target.marker.hasMarker(this.GUARD_PRESS)) {
      effect.damage -= 30;
      return state;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_GUARD_PRESS, this)) {
      effect.player.marker.removeMarker(this.CLEAR_GUARD_PRESS, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.GUARD_PRESS, this);
      });
    }

    return state;
  }

}