import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, AddSpecialConditionsEffect, SpecialCondition, CheckProvidedEnergyEffect, EnergyCard } from "@ptcg/common";

export class Scovillain extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Capsakid';

  public regulationMark = 'G';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 110;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Hot Bite',
      cost: [CardType.COLORLESS],
      damage: 20,
      text: 'Your opponent\'s Active Pokémon is now Burned.'
    },
    {
      name: 'Super Spicy Breath',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 90,
      damageCalculation: '+',
      text: 'If this Pokémon has any [R] Energy attached, this attack does 90 more damage.'
    }
  ];

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '29';

  public name: string = 'Scovillain';

  public fullName: string = 'Scovillain SVI';


  reduceEffect(store: StoreLike, state: State, effect: Effect) {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
      const pokemon = player.active;

      const checkEnergy = new CheckProvidedEnergyEffect(player, pokemon);
      store.reduceEffect(state, checkEnergy);

      let damage = 90;

      checkEnergy.energyMap.forEach(em => {
        const energyCard = em.card;
        if (energyCard instanceof EnergyCard &&
          (energyCard.provides.includes(CardType.FIRE) ||
            energyCard.provides.includes(CardType.ANY) ||
            energyCard.blendedEnergies?.includes(CardType.FIRE))
        ) {
          damage += 90;
        }
      });

      effect.damage = damage;

    }
    return state;
  }
}