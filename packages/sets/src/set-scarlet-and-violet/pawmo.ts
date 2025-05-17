import { PokemonCard, Stage, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, COIN_FLIP_PROMPT, YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from "@ptcg/common";

export class Pawmo extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pawmi';
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Thunder Shock',
      cost: [L],
      damage: 30,
      text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
    },
    { name: 'Head Bolt', cost: [L, L, C], damage: 70, text: '' },
  ];

  public set: string = 'SVI';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '75';
  public name: string = 'Pawmo';
  public fullName: string = 'Pawmo SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (!result)
          return;
        YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
      });
    }

    return state;
  }
}