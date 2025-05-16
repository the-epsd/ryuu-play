import { StoreLike, State, Effect, Attack, AttackEffect, CardType, GameError, GameMessage, PokemonCard, Stage, WAS_ATTACK_USED, Weakness, ADD_MARKER, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, REPLACE_MARKER_AT_END_OF_TURN } from '@ptcg/common';

export class Lombre extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Lotad';
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness: Weakness[] = [{ type: L }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    { name: 'Aqua Slash', 
      cost: [W, W], 
      damage: 70, 
      text: 'During your next turn, this Pokémon can\'t attack.' 
    },
  ];

  public set: string = 'JTG';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '36';
  public name: string = 'Lombre';
  public fullName: string = 'Lombre JTG';

  private readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  private readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_2_MARKER, this);
    REPLACE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_MARKER, this.ATTACK_USED_2_MARKER, this);

    if (effect instanceof AttackEffect) {
      if (HAS_MARKER(this.ATTACK_USED_MARKER, effect.player, this) || HAS_MARKER(this.ATTACK_USED_2_MARKER, effect.player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_MARKER(this.ATTACK_USED_MARKER, effect.player, this);
    }

    return state;
  }
}