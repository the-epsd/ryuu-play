import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, StateUtils, PutDamageEffect, EndTurnEffect, PlayerType } from "@ptcg/common";

export class Nidoqueen extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Nidorina';
  public cardType: CardType = CardType.DARK;
  public hp: number = 170;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Queen Press',
      cost: [CardType.DARK, CardType.COLORLESS],
      damage: 90,
      text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Basic Pokémon.'
    },
    {
      name: 'Lunge Out',
      cost: [CardType.DARK, CardType.DARK, CardType.COLORLESS],
      damage: 160,
      text: ''
    }];

  public set: string = 'MEW';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '31';
  public name: string = 'Nidoqueen';
  public fullName: string = 'Nidoqueen MEW';

  public readonly PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER: string = 'PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER';
  public readonly CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER: string = 'CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.marker.addMarker(this.PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER, this);
      return state;
    }

    if (effect instanceof PutDamageEffect
      && effect.target.marker.hasMarker(this.PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER)) {
      const card = effect.source.getPokemonCard();

      if (card?.stage === Stage.BASIC) {
        effect.preventDefault = true;
      }

      return state;
    }

    if (effect instanceof EndTurnEffect) {

      if (effect.player.marker.hasMarker(this.CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER, this)) {
        effect.player.marker.removeMarker(this.CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER, this);
        const opponent = StateUtils.getOpponent(state, effect.player);
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          cardList.marker.removeMarker(this.PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER, this);
        });
      }
    }

    return state;
  }

}
