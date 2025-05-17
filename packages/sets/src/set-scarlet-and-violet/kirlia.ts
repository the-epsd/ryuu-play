import { PokemonCard, Stage, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, StateUtils, CheckProvidedEnergyEffect } from "@ptcg/common";

export class Kirlia extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Ralts';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    { name: 'Magical Shot', cost: [P, C], damage: 30, text: '' },
    {
      name: 'Psychic',
      cost: [P, C, C],
      damage: 60,
      damageCalculation: '+',
      text: 'This attack does 20 more damage for each Energy attached to your opponent\'s Active Pokémon.'
    }];

  public set: string = 'SVI';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';
  public name: string = 'Kirlia';
  public fullName: string = 'Kirlia SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const energyCount = checkProvidedEnergyEffect.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      effect.damage += energyCount * 20;
    }

    return state;
  }
}