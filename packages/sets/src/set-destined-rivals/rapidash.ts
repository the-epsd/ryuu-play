import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, Effect, WAS_POWER_USED, HAS_MARKER, GameError, GameMessage, ABILITY_USED, DRAW_CARDS, ADD_MARKER, REMOVE_MARKER_AT_END_OF_TURN } from "@ptcg/common";

export class Rapidash extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Ponyta';
  public cardType: CardType = R;
  public hp: number = 110;
  public weakness = [{ type: W }];
  public retreat = [ C ];

  public powers = [{
    name: 'Hurried Gait',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may draw a card.'
  }];

  public attacks = [{ name: 'Fire Mane', cost: [ R, C ], damage: 60, text: '' }];

  public set: string = 'SV9a';
  public name: string = 'Rapidash';
  public fullName: string = 'Rapidash SV9a';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';

  public readonly HURRIED_GAIT_MARKER = 'HURRIED_GAIT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hurried Gait
    if (WAS_POWER_USED(effect, 0, this)){
      const player = effect.player;

      if (HAS_MARKER(this.HURRIED_GAIT_MARKER, player, this)){
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      if (player.deck.cards.length === 0){
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      ABILITY_USED(player, this);
      DRAW_CARDS(player, 1);

      ADD_MARKER(this.HURRIED_GAIT_MARKER, player, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.HURRIED_GAIT_MARKER, this);

    return state;
  }

}