import { PokemonCard, Stage, CardType } from "@ptcg/common";

export class Charcadet extends PokemonCard {
  public regulationMark = 'G';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Heat Blast',
    cost: [R, R, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';
  public name: string = 'Charcadet';
  public fullName: string = 'Charcadet SVI';
}