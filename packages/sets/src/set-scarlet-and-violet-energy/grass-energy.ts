import { EnergyCard, CardType } from '@ptcg/common';

export class GrassEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.GRASS];

  public set: string = 'SVE';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '1';

  public name = 'Grass Energy';

  public fullName = 'Grass Energy SVE';

}
