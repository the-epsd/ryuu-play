import { EnergyCard, CardType } from '@ptcg/common';

export class FireEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.FIRE];

  public set: string = 'SVE';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '2';

  public name = 'Fire Energy';

  public fullName = 'Fire Energy SVE';

}
