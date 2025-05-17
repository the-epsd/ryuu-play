import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, DealDamageEffect } from "@ptcg/common";

export class MarniesScrafty extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Marnie\'s Scraggy';
  public tags = [CardTag.MARNIES];
  public cardType: CardType = D;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Rear Kick',
    cost: [D],
    damage: 40,
    text: ''
  }, {
    name: 'Wild Tackle',
    cost: [D, D, C],
    damage: 160,
    text: 'This Pokémon also does 30 damage to itself.'
  }];

  public regulationMark = 'I';
  public set: string = 'SVOM';
  public setNumber = '4';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Marnie\'s Scrafty';
  public fullName: string = 'Marnie\'s Scrafty SVOM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const dealDamage = new DealDamageEffect(effect, 30);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }
    return state;
  }
}
