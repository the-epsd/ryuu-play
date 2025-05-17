import { PokemonCard, Stage, CardType } from "@ptcg/common";

export class Larvitar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Corkscrew Punch',
      cost: [ F ],
      damage: 10,
      text: '',
    },
    {
      name: 'Confront',
      cost: [ F, F ],
      damage: 30,
      text: '',
    },
    
  ];

  public regulationMark = 'G';
  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '105';
  public name: string = 'Larvitar';
  public fullName: string = 'Larvitar OBF';
}