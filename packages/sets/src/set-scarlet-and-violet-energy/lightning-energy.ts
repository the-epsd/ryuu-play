import { EnergyCard, CardType } from '@ptcg/common';

export class LightningEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.LIGHTNING];

  public set: string = 'SVE';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '4';

  public name = 'Lightning Energy';

  public fullName = 'Lightning Energy SVE';

}
