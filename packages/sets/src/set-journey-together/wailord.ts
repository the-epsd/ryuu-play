import { StoreLike, State, Effect, AttackEffect, CardType, CheckProvidedEnergyEffect, PokemonCard, Stage } from '@ptcg/common';

export class Wailord extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Wailmer';
  public cardType: CardType = W;
  public hp: number = 240;
  public weakness = [{ type: L }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Hydro Pump',
    cost: [C, C, C, C],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 50 more damage for each [W] Energy attached to this Pokémon.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'JTG';
  public setNumber: string = '41';
  public name: string = 'Wailord';
  public fullName: string = 'Wailord JTG';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hydro Pump
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return cardType === CardType.WATER || cardType === CardType.ANY;
        }).length;
      });
      effect.damage += energyCount * 50;
    }

    return state;
  }
}