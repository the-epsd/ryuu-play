import { TrainerCard, TrainerType, StoreLike, State, Effect, TrainerEffect, StateUtils, GameError, GameMessage, PowerEffect, EndTurnEffect } from '@ptcg/common';

export class HexManiac extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'AOR';

  public setNumber = '75';

  public name: string = 'Hex Maniac';

  public fullName: string = 'Hex Maniac AOR';

  public cardImage: string = 'assets/cardback.png';

  public text: string =
    'Until the end of your opponent\'s next turn, each Pokémon in play, in each player\'s hand, and in each player\'s discard pile has no Abilities. (This includes cards that come into play on that turn.)';

  public HEX_MANIAC_MARKER = 'HEX_MANIAC_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      player.supporterTurn = 1;

      player.marker.addMarker(this.HEX_MANIAC_MARKER, this);
      opponent.marker.addMarker(this.HEX_MANIAC_MARKER, this);

      player.supporter.moveCardTo(effect.trainerCard, player.discard);
    }

    if (effect instanceof PowerEffect && (
      effect.player.marker.hasMarker(this.HEX_MANIAC_MARKER, this) ||
      StateUtils.getOpponent(state, effect.player).marker.hasMarker(this.HEX_MANIAC_MARKER, this))) {
      throw new GameError(GameMessage.ABILITY_BLOCKED);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.HEX_MANIAC_MARKER)) {
      effect.player.marker.removeMarker(this.HEX_MANIAC_MARKER, this);
    }

    return state;

  }
}