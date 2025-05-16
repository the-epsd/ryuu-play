import { StoreLike, State, Effect, AttackEffect, CardType, PokemonCard, PutDamageEffect, Stage } from '@ptcg/common';

export class Bagon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 70;
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Bite',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Reckless Charge',
      cost: [R, W],
      damage: 50,
      text: 'This Pokémon also does 10 damage to itself.'
    },

  ];

  public set: string = 'JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '112';
  public name: string = 'Bagon';
  public fullName: string = 'Bagon JTG';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const damageEffect = new PutDamageEffect(effect, 10);
      damageEffect.target = player.active;
      store.reduceEffect(state, damageEffect);
    }

    return state;
  }

}