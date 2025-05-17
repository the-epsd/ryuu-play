import { PokemonCard, Stage, CardType } from "@ptcg/common";

export class Electabuzz extends PokemonCard {
  public regulationMark = 'I';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Electroslug',
      cost: [ L, C ],
      damage: 50,
      text: ''
    },
    
  ];

  public set: string = 'SV9a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '34';
  public name: string = 'Electabuzz';
  public fullName: string = 'Electabuzz SV9a';
}