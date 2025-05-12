import { EnergyCard, CardType } from '@ptcg/common';

export class DarknessEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.DARK];

  public set: string = 'SVE';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '7';

  public name = 'Darkness Energy';

  public fullName = 'Darkness Energy SVE';

}
