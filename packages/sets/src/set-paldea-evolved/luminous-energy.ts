import { EnergyCard, CardType, EnergyType, StoreLike, State, Effect, CheckProvidedEnergyEffect } from "@ptcg/common";

export class LuminousEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'PAL';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '191';

  public name = 'Luminous Energy';

  public fullName = 'Luminous Energy PAL';

  public text =
    'As long as this card is attached to a Pokémon, it provides every type of Energy but provides only 1 Energy at a time.' +
    '' +
    'If the Pokémon this card is attached to has any other Special Energy attached, this card provides [C] Energy instead.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const attachedTo = effect.source;
      const otherSpecialEnergy = attachedTo.cards.some(card => {
        return card instanceof EnergyCard
          && card.energyType === EnergyType.SPECIAL
          && card !== this;
      });

      if (otherSpecialEnergy) {
        effect.energyMap.push({ card: this, provides: [CardType.COLORLESS] });
      } else {
        effect.energyMap.push({ card: this, provides: [CardType.ANY] });
      }
      return state;
    }
    return state;
  }
}