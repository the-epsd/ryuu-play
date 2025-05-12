import { EnergyCard, CardType } from '@ptcg/common';

export class FightingEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.FIGHTING];

  public set: string = 'SVE';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '6';

  public name = 'Fighting Energy';

  public fullName = 'Fighting Energy SVE';

}
