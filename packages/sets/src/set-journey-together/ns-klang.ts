import { StoreLike, State, Effect, AttackEffect, CardTag, CardType, PokemonCard, SpecialCondition, Stage, StateUtils } from '@ptcg/common';

export class NsKlang extends PokemonCard {
  public tags = [CardTag.NS];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'N\'s Klink';
  public cardType: CardType = M;
  public hp: number = 160;
  public weakness = [{ type: R }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Twirling Gear',
    cost: [C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Your opponent\'s Active Pokémon is now Confused.'
  },
  {
    name: 'Confront',
    cost: [M, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '104';
  public name: string = 'N\'s Klang';
  public fullName: string = 'N\'s Klang JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.addSpecialCondition(SpecialCondition.CONFUSED);
    }
    return state;
  }

}