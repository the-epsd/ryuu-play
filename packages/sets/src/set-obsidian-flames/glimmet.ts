import { PokemonCard, Stage, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, ADD_POISON_TO_PLAYER_ACTIVE } from "@ptcg/common";

export class Glimmet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Poison Shard',
    cost: [F, F],
    damage: 20,
    text: 'Your opponent\'s Active Pokémon is now Poisoned.'
  }];

  public set: string = 'OBF';
  public regulationMark: string = 'G';
  public setNumber: string = '122';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Glimmet';
  public fullName: string = 'Glimmet OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)){
      const opponent = effect.opponent;
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
    }

    return state;
  }

}