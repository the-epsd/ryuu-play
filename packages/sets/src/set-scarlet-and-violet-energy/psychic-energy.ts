import { EnergyCard, CardType } from '@ptcg/common';

export class PsychicEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.PSYCHIC];

  public set: string = 'SVE';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '5';

  public name = 'Psychic Energy';

  public fullName = 'Psychic Energy SVE';

}
