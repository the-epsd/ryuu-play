import { StoreLike, State, Effect, AttackEffect, CardTag, CardType, EndTurnEffect, GameError, GameMessage, PlayerType, PokemonCard, PutDamageEffect, RetreatEffect, Stage, StateUtils } from '@ptcg/common';

export class HopsSandaconda extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Hop\'s Silicobra';
  public tags = [CardTag.HOPS];
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Rumble',
      cost: [F, C],
      damage: 30,
      text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.',
    },
    {
      name: 'Break Ground',
      cost: [F, C, C],
      damage: 140,
      text: 'This attack also does 20 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) '
    },
  ];

  public regulationMark = 'I';
  public set: string = 'JTG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '87';
  public name: string = 'Hop\'s Sandaconda';
  public fullName: string = 'Hop\'s Sandaconda JTG';

  public readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      effect.damage = 250;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (cardList === player.active) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 20);
        damageEffect.target = cardList;
        store.reduceEffect(state, damageEffect);
      });
    }


    if (effect instanceof RetreatEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    }

    return state;
  }


}