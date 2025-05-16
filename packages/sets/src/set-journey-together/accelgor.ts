import { PokemonCard, Stage, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, StateUtils, ADD_POISON_TO_PLAYER_ACTIVE, ADD_CONFUSION_TO_PLAYER_ACTIVE, SWITCH_ACTIVE_WITH_BENCHED, AFTER_ATTACK } from '@ptcg/common';

export class Accelgor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Shelmet';
  public cardType: CardType = G;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Poisonous Ploy',
    cost: [G, C],
    damage: 70,
    text: 'Your opponent\'s Active Pokémon is now Confused and Poisoned. Switch this Pokémon with 1 of your Benched Pokémon.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'JTG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public name: string = 'Accelgor';
  public fullName: string = 'Accelgor JTG';

  public usedEphemeralPoison = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, opponent, this);
      this.usedEphemeralPoison = true;
    }

    if (AFTER_ATTACK(effect) && this.usedEphemeralPoison) {
      const player = effect.player;
      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
      this.usedEphemeralPoison = false;
    }

    return state;
  }
}