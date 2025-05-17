import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, Effect, AttackEffect, DealDamageEffect } from "@ptcg/common";

export class TeamRocketsTarountula extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = G;
  public hp: number = 50;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Take Down',
      cost: [G],
      damage: 30,
      text: 'This Pokémon also does 10 damage to itself.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '8';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Tarountula';
  public fullName: string = 'Team Rocket\'s Tarountula SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const dealDamage = new DealDamageEffect(effect, 10);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }
    return state;
  }
} 