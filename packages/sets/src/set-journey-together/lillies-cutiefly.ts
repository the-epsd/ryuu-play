import { StoreLike, State, Effect, AttackEffect, CardTag, CardType, HealTargetEffect, PokemonCard, Stage } from '@ptcg/common';

export class LilliesCutiefly extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.LILLIES];
  public cardType: CardType = P;
  public hp: number = 30;
  public weakness = [{ type: M }];
  public retreat = [];

  public attacks = [
    {
      name: 'Hold Still',
      cost: [P],
      damage: 0,
      text: 'Heal 10 damage from this Pokémon.'
    }
  ];

  public set: string = 'JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';
  public name: string = 'Lillie\'s Cutiefly';
  public fullName: string = 'Lillie\'s Cutiefly JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const healTargetEffect = new HealTargetEffect(effect, 10);
      healTargetEffect.target = player.active;
      state = store.reduceEffect(state, healTargetEffect);
    }

    return state;
  }

}