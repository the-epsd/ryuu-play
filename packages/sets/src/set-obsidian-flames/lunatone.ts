import { PokemonCard, Stage, CardType, PowerType } from "@ptcg/common";

export class Lunatone extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'New Moon',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'If you have Solrock in play, prevent all effects of any Stadium ' +
      'done to your Pokémon in play.'
  }];

  public attacks = [{
    name: 'Moon Press',
    cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
    damage: 100,
    text: ''
  }];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '92';

  public name: string = 'Lunatone';

  public fullName: string = 'Lunatone OBF';

}