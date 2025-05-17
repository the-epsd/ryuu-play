import { EnergyCard, CardType, EnergyType, StoreLike, State, Effect, AttachEnergyEffect, IS_SPECIAL_ENERGY_BLOCKED, SpecialCondition, CheckTableStateEffect, StateUtils, PokemonCardList } from "@ptcg/common";

export class TherapeuticEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '193';

  public regulationMark = 'G';

  public name = 'Therapeutic Energy';

  public fullName = 'Therapeutic Energy PAL';

  public text = 'As long as this card is attached to a Pokémon, it provides [C] Energy.' +
    '' +
    'The Pokémon this card is attached to recovers from being Asleep, Confused, or Paralyzed and can\'t be affected by those Special Conditions.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachEnergyEffect && effect.target.cards.includes(this)) {
      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.target)) {
        return state;
      }

      const pokemon = effect.target;

      pokemon.removeSpecialCondition(SpecialCondition.ASLEEP);
      pokemon.removeSpecialCondition(SpecialCondition.PARALYZED);
      pokemon.removeSpecialCondition(SpecialCondition.CONFUSED);
    }

    if (effect instanceof CheckTableStateEffect) {
      const cardList = StateUtils.findCardList(state, this);

      if (cardList instanceof PokemonCardList && cardList.cards.includes(this)) {
        if (IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, cardList)) {
          return state;
        }

        const conditionsToKeep = [SpecialCondition.ABILITY_USED, SpecialCondition.POISONED, SpecialCondition.BURNED];
        const hasSpecialCondition = cardList.specialConditions.some(condition => !conditionsToKeep.includes(condition));
        if (hasSpecialCondition) {
          cardList.specialConditions = cardList.specialConditions.filter(condition => conditionsToKeep.includes(condition));
        }
      }
    }
    return state;
  }
}