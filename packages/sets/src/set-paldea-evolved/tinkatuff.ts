import { PokemonCard, Stage, CardType, StoreLike, State, Effect, EndTurnEffect, AttackEffect, GameError, GameMessage } from "@ptcg/common";

export class Tinkatuff extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 80;
  public weakness = [{ type: CardType.METAL }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom: string = 'Tinkatink';

  public attacks = [{
    name: 'Light Punch',
    cost: [CardType.COLORLESS],
    damage: 30,
    text: ''
  },
  {
    name: 'Boundless Power',
    cost: [CardType.PSYCHIC, CardType.COLORLESS],
    damage: 80,
    text: 'During your next turn, this Pokemon can\'t attack.'
  }];

  public regulationMark: string = 'G';
  public set: string = 'PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '103';
  public name: string = 'Tinkatuff';
  public fullName: string = 'Tinkatuff PAL';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      // Check marker
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
      console.log('marker added');
    }

    return state;
  }
}