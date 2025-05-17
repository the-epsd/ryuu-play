import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, HAS_MARKER, GameError, GameMessage, CONFIRMATION_PROMPT, SWITCH_ACTIVE_WITH_BENCHED, ADD_MARKER, EndTurnEffect } from "@ptcg/common";

export class Victiniex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = R;
  public hp: number = 190;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Strafe',
      cost: [R],
      damage: 30,
      text: 'You may switch this Pokémon with 1 of your Benched Pokémon.'
    },
    {
      name: 'Victory Flame',
      cost: [R, R, C],
      damage: 220,
      text: 'During your next turn, this Pokémon can\'t attack.'
    }
  ];

  public regulationMark = 'G';
  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Victini ex';
  public fullName: string = 'Victini ex OBF';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;

      if (HAS_MARKER(this.ATTACK_USED_MARKER, this, this)){
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result){
          SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
        }
      });
    } 
    
    if (WAS_ATTACK_USED(effect, 1, this)){
      if (HAS_MARKER(this.ATTACK_USED_MARKER, this, this)){
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      ADD_MARKER(this.ATTACK_USED_MARKER, this, this);
      effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
    }

    return state;
  }

}
