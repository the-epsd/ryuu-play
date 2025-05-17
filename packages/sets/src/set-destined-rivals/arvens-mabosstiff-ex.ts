import { PokemonCard, CardTag, Stage, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, HAS_MARKER, GameError, GameMessage, ADD_MARKER, EndTurnEffect, REMOVE_MARKER } from "@ptcg/common";

export class ArvensMabosstiffex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex, CardTag.ARVENS];
  public regulationMark = 'I';
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Arven\'s Maschiff';
  public cardType: CardType = D;
  public hp: number = 270;
  public weakness = [{ type: G }];
  public retreat = [ C, C, C ];

  public attacks = [
    {
      name: 'Hustle Tackle',
      cost: [ C ],
      damage: 30,
      damageCalculation: '+',
      text: 'If this Pokemon has no damage counters on it, this attack does 120 more damage.'
    },
    {
      name: 'Boss\'s Headbutt',
      cost: [C, C, C],
      damage: 210,
      text: 'During your next turn, this Pokémon can\'t use Boss\'s Headbutt.'
    },
  ];

  public set: string = 'SV9a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '52';
  public name: string = 'Arven\'s Mabosstiff ex';
  public fullName: string = 'Arven\'s Mabosstiff ex SV9a';

  // for preventing the pokemon from attacking on the next turn
  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hustle Tackle
    if (WAS_ATTACK_USED(effect, 0, this)){
      if (effect.player.active.damage === 0){
        effect.damage += 120;
      }
    }

    // Boss's Headbutt
    if (WAS_ATTACK_USED(effect, 1, this)){
      if (HAS_MARKER(this.ATTACK_USED_MARKER, effect.player, this)){
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      ADD_MARKER(this.ATTACK_USED_MARKER, effect.player, this);
    }

    // removing the markers for preventing the pokemon from attacking
    if (effect instanceof EndTurnEffect && HAS_MARKER(this.ATTACK_USED_2_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.ATTACK_USED_MARKER, effect.player, this);
      REMOVE_MARKER(this.ATTACK_USED_2_MARKER, effect.player, this);
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.ATTACK_USED_MARKER, effect.player, this)) {
      ADD_MARKER(this.ATTACK_USED_2_MARKER, effect.player, this);
    }
    
    return state;
  }
}