import { StoreLike, State, Effect, AttackEffect, CardTag, CardType, PokemonCard, Stage } from '@ptcg/common';

export class NsReshiram extends PokemonCard {
  public tags = [CardTag.NS];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 130;
  public retreat = [C, C];

  public attacks = [{
    name: 'Powerful Rage',
    cost: [R, L],
    damage: 20,
    text: 'This attack does 20 damage for each damage counter on this Pokémon.'
  },
  {
    name: 'Virtuous Flame',
    cost: [R, R, L, C],
    damage: 170,
    text: ''
  }];

  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public set: string = 'JTG';
  public setNumber = '116';
  public name: string = 'N\'s Reshiram';
  public fullName: string = 'N\'s Reshiram JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      effect.damage = player.active.damage * 2;
    }

    return state;
  }

}