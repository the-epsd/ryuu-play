import { TrainerCard, TrainerType, StoreLike, State, Effect, PlaySupporterEffect, StateUtils, CardTag, UseStadiumEffect, GameError, GameMessage, DRAW_CARDS, EndTurnEffect } from "@ptcg/common";

export class TeamRocketsFactory extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;
  public set: string = 'SV10';
  public regulationMark = 'I';
  public name: string = 'Team Rocket\'s Factory';
  public fullName: string = 'Team Rocket\'s Factory SV10';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '97';
  public text: string = 'Once during either player\'s turn, if a player plays a Supporter with Team Rocket in its name from their hand, they may draw 2 cards.';

  public readonly FACTORY_MARKER = 'FACTORY_MARKER';
  public readonly FACTORY_USED_MARKER = 'FACTORY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlaySupporterEffect && StateUtils.getStadiumCard(state) === this) {
      if (effect.trainerCard.tags.includes(CardTag.TEAM_ROCKET)) {
        effect.player.marker.addMarker(this.FACTORY_MARKER, this);
      }
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this && effect.player.marker.hasMarker(this.FACTORY_MARKER, this)) {
      const player = effect.player;
      if (player.marker.hasMarker(this.FACTORY_USED_MARKER, this)) {
        throw new GameError(GameMessage.CANNOT_USE_STADIUM);
      }
      DRAW_CARDS(player, 2);
      player.marker.addMarker(this.FACTORY_USED_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.FACTORY_MARKER, this)) {
      effect.player.marker.removeMarker(this.FACTORY_MARKER, this);
      effect.player.marker.removeMarker(this.FACTORY_USED_MARKER, this);
    }

    return state;
  }

}
