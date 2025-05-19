import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, StateUtils, CoinFlipPrompt, GameMessage, PutDamageEffect, EndTurnEffect, PlayerType } from "@ptcg/common";

export class Squirtle extends PokemonCard {

  public regulationMark = 'G';

  public stage = Stage.BASIC;

  public cardType = CardType.WATER;

  public hp = 60;

  public weakness = [{
    type: CardType.LIGHTNING,
  }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Withdraw',
    cost: [CardType.WATER],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all damage done to Squirtle by ' +
      'attacks during your opponent\'s next turn.'
  }, {
    name: 'Skull Bash',
    cost: [CardType.WATER, CardType.WATER],
    damage: 20,
    text: ''
  }];

  public set = 'MEW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '7';

  public name = 'Squirtle';

  public fullName = 'Squirtle MEW';

  public readonly PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
  public readonly CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';

  reduceEffect(store: StoreLike, state: State, effect: Effect) {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), flipResult => {
        if (flipResult) {
          player.active.marker.addMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
          opponent.marker.addMarker(this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
        }
      });
    }
    if (effect instanceof PutDamageEffect
      && effect.target.marker.hasMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER)) {
      effect.preventDefault = true;
      return state;
    }
    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
      });
    }
    return state;
  }
}
