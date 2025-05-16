import { StoreLike, State, Effect, AttackEffect, CardType, PokemonCard, PutDamageEffect, Stage } from '@ptcg/common';

export class Pupitar extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Larvitar';
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Take Down',
    cost: [C, C],
    damage: 60,
    text: 'This Pokémon also does 20 damage to itself.'
  }];

  public set: string = 'JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '81';
  public name: string = 'Pupitar';
  public fullName: string = 'Pupitar JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const damageEffect = new PutDamageEffect(effect, 20);
      damageEffect.target = player.active;
      store.reduceEffect(state, damageEffect);
    }

    return state;
  }

}