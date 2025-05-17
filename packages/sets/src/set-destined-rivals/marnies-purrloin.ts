import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, StateUtils, THIS_ATTACK_DOES_X_MORE_DAMAGE } from "@ptcg/common";

export class MarniesPurrloin extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.MARNIES];
  public cardType: CardType = D;
  public hp: number = 60;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Sharp Nail',
    cost: [D],
    damage: 20,
    text: 'If your opponent\'s Active Pokémon is a Pokémon ex, this attack does 40 more damage.'
  }];

  public regulationMark = 'I';
  public set: string = 'SVOM';
  public setNumber = '1';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Marnie\'s Purrloin';
  public fullName: string = 'Marnie\'s Purrloin SVOM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const defending = opponent.active.getPokemonCard();

      if (defending && defending.tags.includes(CardTag.POKEMON_ex)) {
        THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 40);
      }
    }
    return state;
  }
}