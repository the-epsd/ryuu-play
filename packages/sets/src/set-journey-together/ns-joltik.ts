import { StoreLike, State, Effect, AddSpecialConditionsEffect, AttackEffect, CardTag, CardType, PokemonCard, SpecialCondition, Stage, StateUtils } from '@ptcg/common';
import { MOVE_CARDS } from '@ptcg/common';

export class NsJoltik extends PokemonCard {
  public tags = [CardTag.NS];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 40;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Crackling Short',
    cost: [C, C],
    damage: 30,
    text: 'Before doing damage, discard all Pokémon Tool cards from your opponent\'s Active Pokémon. If you discarded a Pokémon Tool card in this way, your opponent\'s Active Pokémon is now Paralyzed.'
  }];

  public regulationMark = 'I';
  public set: string = 'JTG';
  public setNumber: string = '49';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'N\'s Joltik';
  public fullName: string = 'N\'s Joltik JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.tools.length > 0) {
        MOVE_CARDS(store, state, opponent.active, opponent.discard, { cards: opponent.active.tools });
        opponent.active.tools = [];

        const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
        return store.reduceEffect(state, specialCondition);
      }
    }
    return state;
  }
}