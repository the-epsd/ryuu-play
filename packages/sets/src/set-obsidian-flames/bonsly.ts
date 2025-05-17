import { PokemonCard, Stage, CardType, Weakness, Attack, StoreLike, State, Effect, WAS_ATTACK_USED, YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from "@ptcg/common";

export class Bonsly extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 30;
  public weakness: Weakness[] = [{ type: G }];
  public retreat: CardType[] = [];

  public attacks: Attack[] = [{ 
    name: 'Blubbering', 
    cost: [], 
    damage: 10, 
    text: 'Your opponent\'s Active Pokémon is now Confused.' 
  }];

  public set: string = 'OBF';
  public regulationMark: string = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '110';
  public name: string = 'Bonsly';
  public fullName: string = 'Bonsly OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
    }

    return state;
  }
}