import { EnergyCard, CardType } from '@ptcg/common';

export class WaterEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.WATER];

  public set: string = 'SVE';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '3';

  public name = 'Water Energy';

  public fullName = 'Water Energy SVE';

}
