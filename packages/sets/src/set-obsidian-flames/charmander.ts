import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, DealDamageEffect } from "@ptcg/common";

export class Charmander extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 60;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    { name: 'Heat Tackle', cost: [CardType.FIRE], damage: 30, text: 'This Pokémon also does 10 damage to itself.' },
  ];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '26';

  public name: string = 'Charmander';

  public fullName: string = 'Charmander OBF';

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
